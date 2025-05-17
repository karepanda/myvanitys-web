// src/components/Dashboard/Dashboard.jsx (Con manejo de errores mejorado)
import React, { useContext, useEffect, useState } from 'react';
import { Categories } from '../Categories/Categories';
import { ProductCard } from '../ProductCard/ProductCard';
import { NoProductCard } from '../NoProductCard/NoProductCard';
import { SearchedProductCard } from '../SearchedProductCard/SearchedProductCard';
import { VanitysContext } from '../../context/index';
import { useFetchUserProducts } from '../../hooks/useFetchUserProducts';
import './Dashboard.css';
import { Modal } from '../Modal/Modal';
import { UserProfile } from '../UserProfile/UserProfile';
import { Notification } from '../Notification/Notification';

/**
 * Componente que muestra los productos y categorías
 * Con manejo de errores mejorado
 */
const Dashboard = () => {
	const { 
		searchText, 
		showUserProfile, 
		showNotification,
		loading: contextLoading,
		setLoading,
		errorHandler
	} = useContext(VanitysContext);

	// Estado local para controlar errores silenciosos
	const [hasError, setHasError] = useState(false);
	const [errorRetries, setErrorRetries] = useState(0);

	// Usar el hook para obtener productos con mejor manejo de errores
	const { products, error, loading: productsLoading } = useFetchUserProducts();

	// Efecto para manejar errores silenciosamente
	useEffect(() => {
		if (error && !hasError) {
			console.error('Error loading products:', error);
			setHasError(true);
			
			// Solo mostrar el error si no es el primer intento
			if (errorRetries > 0) {
				errorHandler.showGenericError();
			} else {
				// Incrementar contador de intentos
				setErrorRetries(prev => prev + 1);
			}
		}
	}, [error, hasError, errorHandler, errorRetries]);

	// Sincronizar estado de carga con el contexto
	useEffect(() => {
		if (contextLoading !== productsLoading) {
			setLoading(productsLoading);
		}
	}, [productsLoading, contextLoading, setLoading]);
	
	// Obtener productId para reviews si existe
	const productId = products && products[0]?.reviews?.[0]?.productId || null;

	// Filtrar productos basados en texto de búsqueda
	const filteredProducts = searchText && products
		? products.filter((product) =>
				product.name.toLowerCase().includes(searchText.toLowerCase())
			)
		: products || [];

	// Determinar la clase de estilo según el número de productos
	const getStyleClass = () => {
		return !products || products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	// Mostrar loader mientras cargan los productos
	if (productsLoading) {
		return (
			<div className="dashboard">
				<div className="dashboard__loading">
					<div className="dashboard__spinner"></div>
					<p>Cargando tus productos...</p>
				</div>
			</div>
		);
	}

	// Si hay un error que persiste después del primer intento, mostrar mensaje
	if (error && errorRetries > 1) {
		return (
			<div className="dashboard">
				<div className="dashboard__error">
					<p>Ocurrió un error al cargar tus productos.</p>
					<button onClick={() => window.location.reload()}>
						Intentar nuevamente
					</button>
				</div>
			</div>
		);
	}

	// Renderizar el dashboard
	return (
		<div className={getStyleClass()}>
			{!products || products.length === 0 ? (
				<NoProductCard />
			) : searchText && filteredProducts.length === 0 ? (
				<p>No se encontraron productos</p>
			) : (
				<>
					<div className='dashboard__categories'>
						<Categories />
					</div>
					{searchText ? (
						<div className='productCard__wrapper'>
							{filteredProducts.map((product) => (
								<SearchedProductCard 
									key={product.id || `product-${Math.random()}`} 
									product={product} 
								/>
							))}
						</div>
					) : (
						<div className='productCard__wrapper'>
							{products.map((product) => (
								<ProductCard
									key={product.id || `product-${Math.random()}`}
									product={product}
									id={productId}
								/>
							))}
						</div>
					)}
				</>
			)}

			{showUserProfile && (
				<Modal>
					<UserProfile />
				</Modal>
			)}

			{showNotification && (
				<Notification
					description={'El producto ha sido añadido a tu Vanity'}
					highlight={'Vanity'}
				/>
			)}
		</div>
	);
};

export { Dashboard };