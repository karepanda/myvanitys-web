// src/components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';
import { Modal } from '../Modal/Modal';
import { Register } from '../Register/Register';
import { Login } from '../Login/Login';
import { useContext } from 'react';
import { VanitysContext } from '../../context';
import { CreateProductPopup } from '../CreateProductPopup/CreateProductPopup';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const {
        showModalRegister,
        toggleModalRegister,
        toggleModalLogin,
        showModalLogin,
        apiResponse,
        showCreateProductPopup,
        toggleCreateProductPopup,
        searchText,
        handleSearch,
        setApiResponse,
        toggleUserProfile,
        errorHandler
    } = useContext(VanitysContext);

    // Check if the user is authenticated
    const isAuthenticated = !!(apiResponse?.token && apiResponse?.user?.id);

    const getStyleClass = () => {
        return isAuthenticated ? 'header-dashboard' : 'header';
    };

    const navigate = useNavigate();

    const handleHomeClick = () => {
        setApiResponse(null);
        navigate('/');
    };

    // Function to handle login click when already authenticated
    const handleLoginClick = () => {
        if (isAuthenticated) {
            // Show informative message if already authenticated
            errorHandler.showErrorMessage(
                `You are already logged in as ${apiResponse.user.name || apiResponse.user.email}`,
                'Active Session',
                'info'
            );
        } else {
            // If not authenticated, show login modal
            toggleModalLogin();
        }
    };

    // Function to handle register click when already authenticated
    const handleRegisterClick = () => {
        if (isAuthenticated) {
            // Show informative message if already authenticated
            errorHandler.showErrorMessage(
                'You are already logged in. Log out first if you want to create a new account.',
                'Active Session',
                'info'
            );
        } else {
            // If not authenticated, show register modal
            toggleModalRegister();
        }
    };

    return (
        <>
            <header className={getStyleClass()}>
                <h1 className='header__title' onClick={handleHomeClick}>
                    My Vanity´s
                </h1>
                <input
                    className='header__input'
                    type='text'
                    placeholder={isAuthenticated ? 'Products' : ''}
                    value={searchText}
                    onChange={handleSearch}
                />

                {/* ALWAYS show login/register buttons */}
                <button
                    onClick={handleLoginClick}
                    className='header__login'
                >
                    Log in
                </button>

                <button
                    className='header__register'
                    onClick={handleRegisterClick}
                >
                    Register
                </button>

                {showModalLogin && (
                    <Modal>
                        <Login />
                    </Modal>
                )}

                {showModalRegister && (
                    <Modal>
                        <Register />
                    </Modal>
                )}

                {/* Show specific user functionalities if authenticated */}
                {isAuthenticated && (
                    <>
                        <p className='header__products'>Products</p>
                        <button
                            onClick={toggleCreateProductPopup}
                            className='header__create'
                        >
                            Create Product
                        </button>

                        <div>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='46'
                                height='46'
                                viewBox='0 0 24 24'
                                onClick={toggleUserProfile}
                            >
                                <g fill='none' fillRule='evenodd'>
                                    <path d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z' />
                                    <path
                                        fill='currentColor'
                                        d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M8.5 9.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0m9.758 7.484A7.99 7.99 0 0 1 12 20a7.99 7.99 0 0 1-6.258-3.016C7.363 15.821 9.575 15 12 15s4.637.821 6.258 1.984'
                                    />
                                </g>
                            </svg>
                        </div>
                    </>
                )}

                {showCreateProductPopup && (
                    <Modal>
                        <CreateProductPopup />
                    </Modal>
                )}
            </header>
        </>
    );
};

export { Navbar };