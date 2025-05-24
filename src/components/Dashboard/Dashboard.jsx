// src/components/Dashboard/Dashboard.jsx
import React, { useContext } from 'react';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import { useFetchUserProducts } from '../../hooks/useFetchUserProducts';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

import './Dashboard.css';

const Dashboard = () => {
  const {
    searchText,
    showUserProfile,
    showNotification,
  } = useContext(VanitysContext);

  const { products, error, loading } = useFetchUserProducts();

  console.log('🎯 Dashboard render:', {
    productsCount: products?.length || 0,
    loading,
    hasError: !!error,
    searchText,
  });

  const productId = products[0]?.reviews?.[0]?.productId || null;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStyleClass = () => {
    return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
  };

  if (loading) {
    return (
      <div className="dashboard__loading">
        <div className="loading-spinner"></div>
        <p>Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard__error">
        <div className="error-icon">⚠️</div>
        <h3>Error loading products</h3>
        <p>{error.message || 'Could not load your products. Please try again.'}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={getStyleClass()}>
      {products.length === 0 ? (
        <NoProductCard />
      ) : searchText && filteredProducts.length === 0 ? (
        <div className="no-search-results">
          <p>No products found for "{searchText}"</p>
          <p>Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="dashboard__categories">
            <Categories />
          </div>
          <div className="productCard__wrapper">
            {(searchText ? filteredProducts : products).map((product) =>
              searchText ? (
                <SearchedProductCard
                  key={product.id || `product-${Math.random()}`}
                  product={product}
                />
              ) : (
                <ProductCard
                  key={product.id || `product-${Math.random()}`}
                  product={product}
                  id={productId}
                />
              )
            )}
          </div>
        </>
      )}

      {showUserProfile && (
        <Modal>
          <UserProfile />
        </Modal>
      )}

      {showNotification && (
        <Notification
          description="Product has been added to your Vanity"
          highlight="Vanity"
        />
      )}

      {/* 🔥 DEBUG INFO para desarrollo */}
      {/* 
      {process.env.NODE_ENV === 'development' && (
        <div className="dashboard__debug">
          <details>
            <summary>🐛 Debug Info</summary>
            <pre>
              {JSON.stringify(
                {
                  productsState: {
                    count: products?.length || 0,
                    loading,
                    error: error?.message || null,
                    searchText,
                    filteredCount: filteredProducts?.length || 0,
                  },
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )} 
      */}
    </div>
  );
};

export { Dashboard };
