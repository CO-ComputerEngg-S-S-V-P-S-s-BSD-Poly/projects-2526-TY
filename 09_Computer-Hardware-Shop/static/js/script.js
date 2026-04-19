/**
 * S. K. InfoCom - main JS
 */

document.addEventListener('DOMContentLoaded', () => {
    initCategorySelect();
    initProductSearch();
    bindAddToCartButtons();
    bindAddToWishlistButtons();
    initProfessionInput();
    initServiceForm();
    initTooltips();
    initAddressEditModal();
    updateCartCount();
    updateWishlistCount();
    bindCartPageControls();
    bindWishlistPageControls();
    recalcCartTotals();
});

function formatInr(amount) {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
}

function initCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    const professionInput = document.getElementById('professionInput');
    if (!categorySelect) return;
    if (!professionInput) return;

    categorySelect.addEventListener('change', function () {
        if (this.value) {
            professionInput.value = this.value;
        }
    });
}

function initProductSearch() {
    const searchForm = document.getElementById('catalog-search-form');
    const searchInput = document.getElementById('product-search');
    const suggestionsContainer = document.getElementById('product-suggestions');
    if (!searchInput || !suggestionsContainer) return;

    let selectedIndex = -1;
    let suggestionsAbortController = null;
    let lastFetchedQuery = '';

    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            const query = searchInput.value.trim();
            if (!query) {
                event.preventDefault();
                window.location.href = '/products';
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        selectedIndex = -1;

        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            if (suggestionsAbortController) {
                suggestionsAbortController.abort();
            }
            return;
        }
        fetchProductSuggestions(query);
    });

    searchInput.addEventListener('keydown', function (e) {
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');

        if (suggestionsContainer.style.display === 'block' && items.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items, selectedIndex);
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection(items, selectedIndex);
                return;
            }

            if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                const selectedItem = items[selectedIndex];
                const productId = selectedItem?.dataset?.id;
                if (productId) {
                    window.location.href = `/product/${productId}`;
                }
                return;
            }
        }

        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
            selectedIndex = -1;
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            submitSearch(searchInput.value.trim());
        }
    });

    suggestionsContainer.addEventListener('mousedown', function (e) {
        const selectedItem = e.target.closest('.suggestion-item');
        if (!selectedItem) return;
        const productId = selectedItem.dataset.id;
        if (!productId) return;
        window.location.href = `/product/${productId}`;
    });

    function updateSelection(items, index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    async function fetchProductSuggestions(query) {
        if (suggestionsAbortController) {
            suggestionsAbortController.abort();
        }

        suggestionsAbortController = new AbortController();
        lastFetchedQuery = query;

        try {
            const response = await fetch(`/api/product_suggestions?q=${encodeURIComponent(query)}`, {
                signal: suggestionsAbortController.signal
            });

            if (!response.ok) {
                throw new Error('Suggestions request failed');
            }

            const data = await response.json();
            if (searchInput.value.trim() !== lastFetchedQuery) {
                return;
            }
            renderSuggestions(Array.isArray(data) ? data : []);
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Error fetching suggestions:', error);
            suggestionsContainer.style.display = 'none';
        }
    }

    function renderSuggestions(suggestions) {
        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        let html = '';
        suggestions.forEach((s) => {
            const categoryBadge = s.category ? `<span class="suggestion-category">${s.category}</span>` : '';
            html += `
                <div class="suggestion-item" data-id="${s.id}" data-name="${s.name}">
                    <span>${s.name}</span>
                    ${categoryBadge}
                </div>
            `;
        });

        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
        selectedIndex = -1;
    }

    function submitSearch(query) {
        if (searchForm) {
            if (!query) {
                window.location.href = '/products';
                return;
            }
            searchInput.value = query;
            searchForm.requestSubmit();
            return;
        }

        if (!query) {
            window.location.href = '/products';
            return;
        }

        window.location.href = `/products?q=${encodeURIComponent(query)}&scope=global`;
    }
}
function bindAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', async function () {
            const productId = this.dataset.id;
            const productName = this.dataset.name || this.closest('.card')?.querySelector('.card-title')?.textContent || 'Item';
            const hadOutline = this.classList.contains('btn-outline-dark');
            const hadDark = this.classList.contains('btn-dark');

            await addToCart(productId, productName);

            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.classList.add('btn-success');
            this.classList.remove('btn-outline-dark', 'btn-dark');

            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
                if (hadOutline) this.classList.add('btn-outline-dark');
                if (hadDark) this.classList.add('btn-dark');
            }, 1400);
        });
    });
}

function bindAddToWishlistButtons() {
    document.querySelectorAll('.add-to-wishlist').forEach((button) => {
        button.addEventListener('click', async function () {
            const productId = this.dataset.id;
            const productName = this.dataset.name || 'Item';
            await addToWishlist(productId, productName);
        });
    });

    document.querySelectorAll('.add-prebuild-to-wishlist').forEach((button) => {
        button.addEventListener('click', async function () {
            const profileKey = this.dataset.profileKey || 'student';
            const setupIndex = this.dataset.setupIndex;
            const setupName = this.dataset.name || 'Pre-build setup';
            await addPrebuildToWishlist(profileKey, setupIndex, setupName);
        });
    });
}

function initProfessionInput() {
    const professionInput = document.getElementById('professionInput');
    if (!professionInput) return;

    professionInput.addEventListener('input', debounce(function (e) {
        const query = e.target.value;
        if (query.length > 2) {
            fetchRecommendations(query);
        }
    }, 300));
}

function initServiceForm() {
    const serviceForm = document.getElementById('serviceForm');
    if (!serviceForm) return;

    serviceForm.addEventListener('submit', function (e) {
        const serviceType = document.querySelector('input[name="service_type"]:checked');
        if (!serviceType) {
            e.preventDefault();
            alert('Please select a service type');
        }
    });
}

function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

async function addToCart(productId, productName) {
    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error adding to cart');
        showNotification(`${productName} added to cart!`, 'success');
        updateCartCount();
    } catch (err) {
        showNotification(err.message, 'danger');
    }
}

function redirectToLogin(loginUrl, fallbackPath) {
    if (loginUrl) {
        window.location.href = loginUrl;
        return;
    }
    const nextPath = fallbackPath || `${window.location.pathname}${window.location.search}`;
    window.location.href = `/?next=${encodeURIComponent(nextPath)}`;
}

async function addToWishlist(productId, productName) {
    const nextPath = `${window.location.pathname}${window.location.search}`;
    try {
        const res = await fetch('/api/wishlist/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, next: nextPath })
        });
        const data = await res.json();
        if (res.status === 401) {
            redirectToLogin(data.login_url, nextPath);
            return;
        }
        if (!res.ok) throw new Error(data.error || 'Error adding to wishlist');
        showNotification(data.message || `${productName} added to wishlist!`, 'success');
        updateWishlistCount();
    } catch (err) {
        showNotification(err.message, 'danger');
    }
}

async function addPrebuildToWishlist(profileKey, setupIndex, setupName) {
    const nextPath = `${window.location.pathname}${window.location.search}`;
    try {
        const res = await fetch('/api/wishlist/add-prebuild', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_key: profileKey, setup_index: setupIndex, next: nextPath })
        });
        const data = await res.json();
        if (res.status === 401) {
            redirectToLogin(data.login_url, nextPath);
            return;
        }
        if (!res.ok) throw new Error(data.error || 'Error adding pre-build to wishlist');
        showNotification(data.message || `${setupName} added to wishlist!`, 'success');
        updateWishlistCount();
    } catch (err) {
        showNotification(err.message, 'danger');
    }
}

async function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    try {
        const res = await fetch('/api/cart/count');
        const data = await res.json();
        if (data.count > 0) {
            badge.textContent = data.count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    } catch (err) {
        badge.style.display = 'none';
    }
}

async function updateWishlistCount() {
    const badge = document.getElementById('wishlist-count');
    if (!badge) return;
    try {
        const res = await fetch('/api/wishlist/count');
        const data = await res.json();
        if (data.count > 0) {
            badge.textContent = data.count;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    } catch (err) {
        badge.style.display = 'none';
    }
}

function bindWishlistPageControls() {
    const wishlistList = document.getElementById('wishlist-items');
    if (!wishlistList) return;

    const selectAll = document.getElementById('select-all-wishlist-items');
    const removeSelectedBtn = document.getElementById('remove-selected-wishlist-items');
    const clearBtn = document.getElementById('clear-wishlist-items');
    const toolbar = document.getElementById('wishlist-toolbar');

    const selectedRows = () => Array.from(wishlistList.querySelectorAll('.wishlist-item')).filter((row) => row.querySelector('.wishlist-select-item')?.checked);
    const selectedProductIds = () => selectedRows().map((row) => Number(row.dataset.productId)).filter((id) => Number.isInteger(id) && id > 0);
    const selectedSetupIds = () => selectedRows().map((row) => Number(row.dataset.setupId)).filter((id) => Number.isInteger(id) && id > 0);

    wishlistList.querySelectorAll('.wishlist-item').forEach((row) => {
        const openDetail = () => {
            const detailUrl = row.dataset.detailUrl;
            if (detailUrl) {
                window.location.href = detailUrl;
            }
        };

        row.addEventListener('click', (event) => {
            if (isInteractiveTarget(event.target)) return;
            openDetail();
        });

        row.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            if (isInteractiveTarget(event.target)) return;
            event.preventDefault();
            openDetail();
        });
    });

    const updateWishlistState = () => {
        const rows = wishlistList.querySelectorAll('.wishlist-item');
        const emptyEl = document.getElementById('wishlist-empty');

        if (rows.length) {
            if (emptyEl) emptyEl.classList.add('d-none');
            wishlistList.classList.remove('d-none');
            if (toolbar) toolbar.classList.remove('d-none');
        } else {
            if (emptyEl) emptyEl.classList.remove('d-none');
            wishlistList.classList.add('d-none');
            if (toolbar) toolbar.classList.add('d-none');
        }

        if (!selectAll) return;
        const checkboxes = Array.from(wishlistList.querySelectorAll('.wishlist-select-item'));
        const checked = checkboxes.filter((cb) => cb.checked).length;
        selectAll.checked = checkboxes.length > 0 && checked === checkboxes.length;
        selectAll.indeterminate = checked > 0 && checked < checkboxes.length;
    };

    wishlistList.querySelectorAll('.wishlist-remove').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('.wishlist-item');
            const isSetup = row?.dataset.itemType === 'setup';
            const productId = Number(btn.dataset.id || row?.dataset.productId);
            const setupId = Number(btn.dataset.setupId || row?.dataset.setupId);
            const nextPath = `${window.location.pathname}${window.location.search}`;

            const payload = { next: nextPath };
            if (isSetup && Number.isInteger(setupId) && setupId > 0) {
                payload.setup_id = setupId;
            } else if (!isSetup && Number.isInteger(productId) && productId > 0) {
                payload.product_id = productId;
            } else {
                showNotification('Invalid wishlist item.', 'warning');
                return;
            }

            try {
                const res = await fetch('/api/wishlist/remove', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.status === 401) {
                    redirectToLogin(data.login_url, nextPath);
                    return;
                }
                if (!res.ok) throw new Error(data.error || 'Error removing item');
                if (row) row.remove();
                updateWishlistState();
                updateWishlistCount();
                showNotification(data.message || 'Removed from wishlist.', 'info');
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    });

    wishlistList.querySelectorAll('.wishlist-move-to-cart').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('.wishlist-item');
            const isSetup = row?.dataset.itemType === 'setup';
            const productId = Number(btn.dataset.id || row?.dataset.productId);
            const setupId = Number(btn.dataset.setupId || row?.dataset.setupId);
            const itemName = btn.dataset.name || 'Item';
            const nextPath = `${window.location.pathname}${window.location.search}`;

            const payload = { next: nextPath };
            if (isSetup && Number.isInteger(setupId) && setupId > 0) {
                payload.setup_id = setupId;
            } else if (!isSetup && Number.isInteger(productId) && productId > 0) {
                payload.product_id = productId;
            } else {
                showNotification('Invalid wishlist item.', 'warning');
                return;
            }

            try {
                const res = await fetch('/api/wishlist/move-to-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.status === 401) {
                    redirectToLogin(data.login_url, nextPath);
                    return;
                }
                if (!res.ok) throw new Error(data.error || 'Error moving item');
                if (row) row.remove();
                updateWishlistState();
                updateWishlistCount();
                updateCartCount();
                showNotification(data.message || `${itemName} moved to cart.`, 'success');
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    });

    wishlistList.querySelectorAll('.wishlist-select-item').forEach((checkbox) => {
        checkbox.addEventListener('change', updateWishlistState);
    });

    if (selectAll) {
        selectAll.addEventListener('change', () => {
            wishlistList.querySelectorAll('.wishlist-select-item').forEach((checkbox) => {
                checkbox.checked = selectAll.checked;
            });
            updateWishlistState();
        });
    }

    if (removeSelectedBtn) {
        removeSelectedBtn.addEventListener('click', async () => {
            const productIds = selectedProductIds();
            const setupIds = selectedSetupIds();
            if (!productIds.length && !setupIds.length) {
                showNotification('Select wishlist items first.', 'warning');
                return;
            }
            const nextPath = `${window.location.pathname}${window.location.search}`;
            try {
                const res = await fetch('/api/wishlist/remove-selected', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_ids: productIds, setup_ids: setupIds, next: nextPath })
                });
                const data = await res.json();
                if (res.status === 401) {
                    redirectToLogin(data.login_url, nextPath);
                    return;
                }
                if (!res.ok) throw new Error(data.error || 'Error removing selected items');
                selectedRows().forEach((row) => row.remove());
                updateWishlistState();
                updateWishlistCount();
                showNotification(data.message || 'Selected items removed.', 'info');
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            const nextPath = `${window.location.pathname}${window.location.search}`;
            try {
                const res = await fetch('/api/wishlist/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ next: nextPath })
                });
                const data = await res.json();
                if (res.status === 401) {
                    redirectToLogin(data.login_url, nextPath);
                    return;
                }
                if (!res.ok) throw new Error(data.error || 'Error clearing wishlist');
                wishlistList.innerHTML = '';
                updateWishlistState();
                updateWishlistCount();
                showNotification(data.message || 'Wishlist cleared.', 'info');
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    }

    updateWishlistState();
}

async function fetchRecommendations(query) {
    try {
        await fetch(`/api/recommendations?profession=${encodeURIComponent(query)}`);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top:20px;right:20px;z-index:9999;min-width:300px;';
    notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

window.updateCartCount = updateCartCount;
window.updateWishlistCount = updateWishlistCount;

function isInteractiveTarget(target) {
    return Boolean(target.closest('a, button, input, label, select, textarea, form'));
}

function parseProductIds(rawIds) {
    return String(rawIds || '')
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value > 0);
}

async function removeCartProducts(productIds) {
    const ids = Array.from(new Set(productIds));
    if (!ids.length) {
        showNotification('Select cart items first.', 'warning');
        return;
    }

    try {
        const res = await fetch('/api/cart/remove-selected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_ids: ids })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error removing selected cart items');
        showNotification(data.message || 'Selected items removed.', 'info');
        window.location.reload();
    } catch (err) {
        showNotification(err.message, 'danger');
    }
}

function bindCartPageControls() {
    const cartList = document.getElementById('cart-items');
    if (!cartList) return;

    const selectAll = document.getElementById('select-all-cart-items');
    const removeSelectedBtn = document.getElementById('remove-selected-cart-items');
    const clearBtn = document.getElementById('clear-cart-items');

    cartList.querySelectorAll('.cart-item').forEach((row) => {
        const openDetail = () => {
            const detailUrl = row.dataset.detailUrl;
            if (detailUrl) {
                window.location.href = detailUrl;
            }
        };

        row.addEventListener('click', (event) => {
            if (isInteractiveTarget(event.target)) return;
            openDetail();
        });

        row.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            if (isInteractiveTarget(event.target)) return;
            event.preventDefault();
            openDetail();
        });
    });

    cartList.querySelectorAll('.qty-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('.cart-item');
            if (!row || row.dataset.itemType !== 'product') return;

            const pid = row.dataset.productId;
            const qtyDisplay = row.querySelector('.cart-qty-value');
            let qty = parseInt(qtyDisplay?.textContent || '1', 10) || 1;
            if (btn.dataset.action === 'inc') {
                qty += 1;
            } else {
                qty = Math.max(0, qty - 1);
            }
            await updateCartQuantity(pid, qty, row);
        });
    });

    cartList.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('.cart-item');
            if (!row) return;
            const ids = parseProductIds(row.dataset.productIds);
            await removeCartProducts(ids);
        });
    });

    cartList.querySelectorAll('.move-to-wishlist').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const row = btn.closest('.cart-item');
            if (!row || row.dataset.itemType !== 'product') return;

            const pid = row.dataset.productId;
            if (!pid) return;
            const nextPath = `${window.location.pathname}${window.location.search}`;
            try {
                const res = await fetch('/api/cart/move-to-wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: pid, next: nextPath })
                });
                const data = await res.json();
                if (res.status === 401) {
                    redirectToLogin(data.login_url, nextPath);
                    return;
                }
                if (!res.ok) throw new Error(data.error || 'Error moving item');
                row.remove();
                recalcCartTotals();
                updateCartCount();
                updateWishlistCount();
                showNotification(data.message || 'Moved to wishlist.', 'success');
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    });

    cartList.querySelectorAll('.cart-select-item').forEach((checkbox) => {
        checkbox.addEventListener('change', recalcCartTotals);
    });

    if (selectAll) {
        selectAll.addEventListener('change', () => {
            cartList.querySelectorAll('.cart-select-item').forEach((checkbox) => {
                checkbox.checked = selectAll.checked;
            });
            recalcCartTotals();
        });
    }

    if (removeSelectedBtn) {
        removeSelectedBtn.addEventListener('click', async () => {
            const selectedIds = [];
            cartList.querySelectorAll('.cart-item').forEach((row) => {
                const checkbox = row.querySelector('.cart-select-item');
                if (!checkbox || !checkbox.checked) return;
                selectedIds.push(...parseProductIds(row.dataset.productIds));
            });
            await removeCartProducts(selectedIds);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            try {
                const res = await fetch('/api/cart/clear', { method: 'POST' });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error clearing cart');
                showNotification(data.message || 'Cart cleared.', 'info');
                window.location.reload();
            } catch (err) {
                showNotification(err.message, 'danger');
            }
        });
    }
}

async function updateCartQuantity(productId, quantity, row) {
    try {
        const res = await fetch('/api/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error updating cart');

        if (quantity === 0) {
            row.remove();
        } else {
            const qtyDisplay = row.querySelector('.cart-qty-value');
            if (qtyDisplay) qtyDisplay.textContent = quantity;
            const decBtn = row.querySelector('.dec-btn i');
            if (decBtn) {
                decBtn.className = `fas ${quantity > 1 ? 'fa-minus' : 'fa-trash'}`;
            }
        }
        recalcCartTotals();
        updateCartCount();
    } catch (err) {
        showNotification(err.message, 'danger');
    }
}

function recalcCartTotals() {
    const rows = document.querySelectorAll('.cart-item');
    const totalEl = document.getElementById('cart-total');
    const selectedCountEl = document.getElementById('selected-items-count');
    const empty = document.getElementById('cart-empty');
    const addressSection = document.getElementById('address-section');
    const paymentSummary = document.getElementById('payment-summary');
    const selectedInput = document.getElementById('selected-product-ids');
    const proceedBtn = document.getElementById('proceed-payment-btn');
    const selectAll = document.getElementById('select-all-cart-items');
    const selectToolbar = document.getElementById('cart-select-toolbar');

    let selectedTotal = 0;
    let selectedCount = 0;
    const selectedIds = new Set();

    rows.forEach((row) => {
        const price = parseFloat(row.dataset.price || '0');
        const qty = parseInt(row.querySelector('.cart-qty-value')?.textContent || '1', 10) || 1;
        const subtotal = price * qty;
        const subEl = row.querySelector('.cart-subtotal');
        if (subEl) subEl.textContent = formatInr(subtotal);

        const checkbox = row.querySelector('.cart-select-item');
        if (checkbox && checkbox.checked) {
            selectedTotal += subtotal;
            selectedCount += 1;
            parseProductIds(row.dataset.productIds).forEach((id) => selectedIds.add(id));
        }
    });

    if (totalEl) totalEl.textContent = formatInr(selectedTotal);
    if (selectedCountEl) selectedCountEl.textContent = `${selectedCount} of ${rows.length} selected`;
    if (selectedInput) selectedInput.value = Array.from(selectedIds).join(',');
    if (proceedBtn) proceedBtn.disabled = selectedIds.size === 0;

    if (selectAll) {
        selectAll.checked = rows.length > 0 && selectedCount === rows.length;
        selectAll.indeterminate = selectedCount > 0 && selectedCount < rows.length;
    }

    if (!rows.length) {
        if (empty) empty.classList.remove('d-none');
        if (addressSection) addressSection.classList.add('d-none');
        if (paymentSummary) paymentSummary.classList.add('d-none');
        if (selectToolbar) selectToolbar.classList.add('d-none');
    } else {
        if (empty) empty.classList.add('d-none');
        if (addressSection) addressSection.classList.remove('d-none');
        if (paymentSummary) paymentSummary.classList.remove('d-none');
        if (selectToolbar) selectToolbar.classList.remove('d-none');
    }
}

function initAddressEditModal() {
    const editButtons = document.querySelectorAll('.edit-address-btn');
    const form = document.getElementById('edit-address-form');
    const fullNameInput = document.getElementById('edit-full-name');
    const mobileInput = document.getElementById('edit-mobile');
    const addressInput = document.getElementById('edit-address');
    const defaultInput = document.getElementById('edit-default');

    if (!editButtons.length || !form) return;

    editButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (!id) return;

            form.action = `/addresses/${id}/update`;
            if (fullNameInput) fullNameInput.value = btn.dataset.fullName || '';
            if (mobileInput) mobileInput.value = btn.dataset.mobile || '';
            if (addressInput) addressInput.value = btn.dataset.address || '';
            if (defaultInput) defaultInput.checked = btn.dataset.default === '1';
        });
    });
}