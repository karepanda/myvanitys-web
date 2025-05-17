// src/components/Dashboard/Dashboard.jsx
import React, { useContext } from 'react';
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
 * Su única responsabilidad es la UI del dashboard
 */
const Dashboard = () => {
	const { 
		searchText, 
		showUserProfile, 
		showNotification,
		loading: contextLoading,
		setLoading
	} = useContext(VanitysContext);

	// Usar el hook para obtener productos
	const { products, error, loading: productsLoading } = useFetchUserProducts();

	// Sincronizar estado de carga con el contexto
	React.useEffect(() => {
		if (contextLoading !== productsLoading) {
			setLoading(productsLoading);
		}
	}, [productsLoading, contextLoading, setLoading]);
	
	// Obtener productId para reviews si existe
	const productId = products[0]?.reviews?.[0]?.productId || null;

	// Filtrar productos basados en texto de búsqueda
	const filteredProducts = searchText
		? products.filter((product) =>
				product.name.toLowerCase().includes(searchText.toLowerCase())
			)
		: products;

	// Determinar la clase de estilo según el número de productos
	const getStyleClass = () => {
		return products.length === 0 ? 'dashboard__noProducts' : 'dashboard';
	};

	// Mostrar loader mientras cargan los productos
	if (productsLoading) {
		return (
			<div className="dashboard__loading">
				<div className="dashboard__spinner"></div>
				<p>Cargando tus productos...</p>
			</div>
		);
	}

	// Si hay un error, mostrar mensaje
	if (error) {
		console.error('Error loading products:', error);
		return (
			<div className="dashboard__error">
				<p>Ocurrió un error al cargar tus productos.</p>
				<button onClick={() => window.location.reload()}>
					Intentar nuevamente
				</button>
			</div>
		);
	}

	// Renderizar el dashboard
	return (
		<div className={getStyleClass()}>
			{products.length === 0 ? (
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
