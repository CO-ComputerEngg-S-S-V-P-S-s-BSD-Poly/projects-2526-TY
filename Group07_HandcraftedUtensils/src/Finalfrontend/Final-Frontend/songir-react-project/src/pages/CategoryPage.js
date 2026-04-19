import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const CategoryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const CategoryHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: #2d3748;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const FilterButton = styled.button`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  background: ${props => props.active ? '#4299e1' : '#f7fafc'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#3182ce' : '#edf2f7'};
  }
`;

const SortSelect = styled.select`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const ResultsCount = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ListImage = styled.div`
  width: 120px;
  height: 120px;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const ListContent = styled.div`
  flex: 1;

  h3 {
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  p {
    color: #718096;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`;

const ListPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const ListActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const AddToCartButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3182ce;
    transform: translateY(-2px);
  }
`;

const WishlistButton = styled.button`
  background: #e2e8f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #cbd5e0;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;

  h3 {
    margin-bottom: 1rem;
    color: #2d3748;
  }
`;

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState([]);

  // Mock products data based on category
  const mockProducts = {
    utensils: [
      { id: 1, name: 'Brass Pooja Thali', price: 2500, rating: 4.5, image: '🪔', description: 'Traditional brass pooja thali with intricate design' },
      { id: 2, name: 'Copper Water Bottle', price: 1800, rating: 4.8, image: '🏺', description: 'Handcrafted copper water bottle' },
      { id: 3, name: 'Brass Dinner Set', price: 4500, rating: 4.6, image: '🍽️', description: 'Complete brass dinner set for 4' },
      { id: 4, name: 'Copper Bowl Set', price: 1200, rating: 4.3, image: '🥣', description: 'Set of 6 copper bowls' },
    ],
    religious: [
      { id: 5, name: 'Brass Diya Set', price: 800, rating: 4.7, image: '🪔', description: 'Traditional brass diyas for puja' },
      { id: 6, name: 'Copper Bell', price: 600, rating: 4.4, image: '🔔', description: 'Handcrafted temple bell' },
      { id: 7, name: 'Brass Idol', price: 3200, rating: 4.9, image: '🕉️', description: 'Beautiful brass deity idol' },
      { id: 8, name: 'Pooja Accessories Set', price: 1500, rating: 4.5, image: '🙏', description: 'Complete pooja accessories kit' },
    ],
    decor: [
      { id: 9, name: 'Wall Hanging', price: 2800, rating: 4.6, image: '🖼️', description: 'Intricate brass wall art' },
      { id: 10, name: 'Decorative Vase', price: 2200, rating: 4.4, image: '🏺', description: 'Copper decorative vase' },
      { id: 11, name: 'Showpiece Set', price: 3800, rating: 4.8, image: '🏛️', description: 'Brass showpiece collection' },
      { id: 12, name: 'Metal Sculpture', price: 5500, rating: 4.9, image: '🎨', description: 'Handcrafted metal sculpture' },
    ]
  };

  useEffect(() => {
    // Load products based on category
    const categoryProducts = mockProducts[category] || [];
    setProducts(categoryProducts);
  }, [category, mockProducts]);

  const categoryTitles = {
    utensils: 'Utensils & Cookware',
    religious: 'Religious Items',
    decor: 'Home Decor'
  };

  const categoryDescriptions = {
    utensils: 'Discover our collection of traditional brass and copper utensils, perfect for your kitchen needs.',
    religious: 'Sacred items crafted with devotion and precision for your spiritual practices.',
    decor: 'Beautiful home decor pieces that add elegance and tradition to your living space.'
  };

  const handleSort = (products, sortBy) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].reverse();
      default:
        return products;
    }
  };

  const sortedProducts = handleSort(products, sortBy);

  return (
    <CategoryContainer>
      <CategoryHeader>
        <h1>{categoryTitles[category] || 'Products'}</h1>
        <p>{categoryDescriptions[category] || 'Explore our curated collection'}</p>
      </CategoryHeader>

      <ControlsBar>
        <LeftControls>
          <FilterButton>
            <Filter size={18} />
            Filters
          </FilterButton>
          <ResultsCount>
            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
          </ResultsCount>
        </LeftControls>

        <RightControls>
          <ViewToggle>
            <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <Grid size={18} />
            </ViewButton>
            <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              <List size={18} />
            </ViewButton>
          </ViewToggle>

          <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Sort by: Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </SortSelect>
        </RightControls>
      </ControlsBar>

      {sortedProducts.length === 0 ? (
        <NoProducts>
          <h3>No products found</h3>
          <p>We couldn't find any products in this category. Please try another category or check back later.</p>
        </NoProducts>
      ) : viewMode === 'grid' ? (
        <ProductsGrid>
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </ProductsGrid>
      ) : (
        <ProductsList>
          {sortedProducts.map((product) => (
            <ListItem key={product.id}>
              <ListImage>{product.image}</ListImage>
              <ListContent>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <ListPrice>₹{product.price}</ListPrice>
                <ListActions>
                  <AddToCartButton>Add to Cart</AddToCartButton>
                  <WishlistButton>♥</WishlistButton>
                </ListActions>
              </ListContent>
            </ListItem>
          ))}
        </ProductsList>
      )}
    </CategoryContainer>
  );
}

export default CategoryPage;
