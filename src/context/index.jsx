import { createContext, useState } from 'react';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = () => {
		setOpenModal(!openModal);
	};

	return (
		<VanitysContext.Provider
			value={{
				showModal,
				setShowModal,
				handleShowModal,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
