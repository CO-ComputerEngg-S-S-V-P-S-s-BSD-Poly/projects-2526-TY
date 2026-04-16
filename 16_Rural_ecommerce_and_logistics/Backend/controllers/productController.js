const Product = require('../models/Product');



// ================= 1. Add New Product =================
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, artisanId } = req.body;

    if (!artisanId) {
      return res.status(400).json({
        msg: "Artisan ID missing! Kripya dubara login karein."
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      artisan: artisanId,
      isApproved: false,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newProduct.save();

    res.status(201).json({
      msg: "Product added! Admin approval ka intezar karein.",
      product: newProduct
    });

  } catch (err) {
    console.error("❌ PRODUCT SAVE ERROR:", err);
    res.status(500).json({
      msg: "Product save karne mein galti hui",
      error: err.message
    });
  }
};



// ================= 2. Get Products by Artisan =================
exports.getArtisanProducts = async (req, res) => {
  try {
    const products = await Product.find({
      artisan: req.params.artisanId
    }).populate('artisan', 'firstName lastName village');

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Artisan products fetch nahi ho paye" });
  }
};



// ================= 3. Get Approved Products (Public/Home) =================
exports.getApprovedProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let query = { isApproved: true };

    if (category && category !== "All") {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("artisan", "firstName lastName village")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ msg: "Products load failed" });
  }
};



// ================= 4. Get Pending Products (Admin) =================
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
      .populate('artisan', 'firstName lastName village');

    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};



// ================= 5. Admin Approve Product =================
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.isApproved = true;
    await product.save();

    res.json({ msg: "Product approved successfully!" });

  } catch (err) {
    res.status(500).json({ msg: "Approval failed" });
  }
};



// ================= 6. Delete Product =================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ msg: "Product nahi mila" });

    res.json({ msg: "Product successfully removed!" });

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};



// ================= 7. Admin: Get All Products =================
exports.getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('artisan', 'firstName lastName village')
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ msg: "Admin product fetch failed" });
  }
};



// ================= 8. ✅ Get Single Product (VERY IMPORTANT) =================
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artisan', 'firstName lastName village');

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.error("Single product fetch error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================= 9. UPDATE PRODUCT (Seller Edit) =================
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    // Agar new image upload hui ho
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json({
      msg: "Product updated successfully!",
      product
    });

  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ msg: "Product update failed" });
  }
};

