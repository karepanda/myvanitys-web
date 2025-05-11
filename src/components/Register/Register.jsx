import React, { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';
import registerLogin from '../../assets/register_logIn.png';

const Register = () => {
  // Solo usa toggleModalRegister que sabemos que existe en el contexto
  const { toggleModalRegister } = useContext(VanitysContext);

  // Función simple que solo cierra este modal
  const handleCloseRegister = () => {
    console.log("Closing register modal");
    toggleModalRegister(); // Usa la función toggle existente
  };

  return (
    <Popup
      title='Register'
      descriptionTitle='Organize your beauty collection effortlessly'
      description='Keep track of your skincare and makeup products with ease – no more wasting time trying to remember what you already have!'
      textButtom='Sign up with Google'
      imageUrl={registerLogin}
      closeFunction={handleCloseRegister}
      authMode='register'
    />
  );
};

export { Register };