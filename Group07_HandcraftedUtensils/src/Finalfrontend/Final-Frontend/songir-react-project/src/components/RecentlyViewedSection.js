// ============================================
// FILE: src/components/RecentlyViewedSection.jsx
// COMPLETE COMPONENT FOR HOMEPAGE
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ChevronLeft, ChevronRight, TrendingUp, Eye } from 'lucide-react';
import { getRecentlyViewed } from '../utils/recentlyViewedUtils';

// ============================================
// ANIMATIONS
// ============================================
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// ============================================
// STYLED COMPONENTS
// ============================================
const Section = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, #fdf4e8 0%, #f5e8d0 100%);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 3rem 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Eyebrow = styled.p`
  color: #b87333;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h2`
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 2.8rem;
  color: #3e2723;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #7a5c3a;
  font-size: 1.1rem;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ScrollContainer = styled.div`
  position: relative;
`;

const ProductsWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductsGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 0.5rem 0;
  min-width: min-content;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid #b87333;
  color: #b87333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(184, 115, 51, 0.2);
  transition: all 0.3s ease;
  z-index: 10;

  ${props => props.direction === 'left' ? 'left: -24px;' : 'right: -24px;'}

  &:hover:not(:disabled) {
    background: #b87333;
    color: white;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 24px rgba(184, 115, 51, 0.35);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    ${props => props.direction === 'left' ? 'left: -12px;' : 'right: -12px;'}
    width: 40px;
    height: 40px;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;
  width: 280px;
  border: 2px solid transparent;
  animation: ${slideIn} 0.6s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(184, 115, 51, 0.2);
    border-color: #b87333;
  }

  @media (max-width: 768px) {
    width: 240px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #fdf4e8 0%, #f5e8d0 100%);

  @media (max-width: 768px) {
    height: 240px;
  }
`;

const ViewedBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #b87333, #d4a017);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(184, 115, 51, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ProductCard}:hover & {
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const Category = styled.span`
  color: #b87333;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  color: #3e2723;
  margin: 0 0 0.8rem;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`;

const Price = styled.span`
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #b87333, #d4a017);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const OldPrice = styled.span`
  font-size: 1rem;
  color: #9e8e7e;
  text-decoration: line-through;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #7a5c3a;
`;

const StarIcon = styled.span`
  color: #f5a623;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9e8e7e;
  animation: ${fadeIn} 0.6s ease-out;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #7a5c3a;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.95rem;
  color: #9e8e7e;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #b87333;
  font-weight: 600;
  animation: ${fadeIn} 0.4s ease-out;
`;

// ============================================
// MAIN COMPONENT
// ============================================
const RecentlyViewedSection = ({ userId = null }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Fetch recently viewed products
  useEffect(() => {
    fetchRecentlyViewed();

    // Listen for updates
    const handleUpdate = () => {
      fetchRecentlyViewed();
    };

    window.addEventListener('recentlyViewedUpdated', handleUpdate);

    return () => {
      window.removeEventListener('recentlyViewedUpdated', handleUpdate);
    };
  }, [userId]);

  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true);
      const data = await getRecentlyViewed(userId, 12);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Update scroll buttons
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener('scroll', updateScrollButtons);
      window.addEventListener('resize', updateScrollButtons);
      
      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, [products]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (product) => {
    navigate('/ProductDetail', { state: { product } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render if loading
  if (loading) {
    return (
      <Section>
        <Container>
          <LoadingState>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            Loading your recently viewed products...
          </LoadingState>
        </Container>
      </Section>
    );
  }

  // Don't render section at all if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <Header>
          <Eyebrow>
            <TrendingUp size={16} /> Your Journey
          </Eyebrow>
          <Title>Recently Viewed</Title>
          <Subtitle>Products you've explored — pick up where you left off</Subtitle>
        </Header>

        <ScrollContainer>
          {canScrollLeft && (
            <NavButton
              direction="left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </NavButton>
          )}

          <ProductsWrapper ref={scrollContainerRef}>
            <ProductsGrid>
              {products.map((product, index) => (
                <ProductCard
                  key={product._id || product.id || index}
                  delay={`${index * 0.08}s`}
                  onClick={() => handleProductClick(product)}
                >
                  <ImageWrapper>
                    <ViewedBadge>
                      <Eye size={12} /> Viewed
                    </ViewedBadge>
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/280x280/fdf4e8/b87333?text=No+Image';
                      }}
                    />
                  </ImageWrapper>

                  <ProductInfo>
                    <Category>{product.category || 'Product'}</Category>
                    <ProductName>{product.name}</ProductName>
                    <PriceRow>
                      <Price>₹{(product.price || 0).toLocaleString('en-IN')}</Price>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <OldPrice>₹{product.oldPrice.toLocaleString('en-IN')}</OldPrice>
                      )}
                    </PriceRow>
                    {product.rating && (
                      <RatingRow>
                        <StarIcon>⭐</StarIcon>
                        <span>{product.rating}</span>
                        {product.reviews > 0 && (
                          <span style={{ color: '#9e8e7e' }}>({product.reviews})</span>
                        )}
                      </RatingRow>
                    )}
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductsGrid>
          </ProductsWrapper>

          {canScrollRight && (
            <NavButton
              direction="right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </NavButton>
          )}
        </ScrollContainer>
      </Container>
    </Section>
  );
};

export default RecentlyViewedSection;