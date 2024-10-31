import { createContext, useState } from 'react';

const VanitysContext = createContext();

const VanitysProvider = ({ children }) => {
	const [showModalRegister, setShowModalRegister] = useState(false);
	const [showModalLogin, setShowModalLogin] = useState(false);

	const toggleModalRegister = () => setShowModalRegister((prev) => !prev);
	const toggleModalLogin = () => setShowModalLogin((prev) => !prev);

	return (
		<VanitysContext.Provider
			value={{
				showModalRegister,
				showModalLogin,
				toggleModalRegister,
				toggleModalLogin,
			}}
		>
			{children}
		</VanitysContext.Provider>
	);
};

export { VanitysContext, VanitysProvider };
