import React, { useContext } from 'react';
import { VanitysContext } from '../../context';
import { Popup } from '../Popup/Popup';
import registerLogin from '../../assets/register_logIn.png';

const Login = () => {
  const { toggleModalLogin } = useContext(VanitysContext);

  const handleCloseLogin = () => {
    console.log("Closing login modal");
    toggleModalLogin(); 
  };

  return (
    <Popup
      title='Login'
      descriptionTitle='Organize your beauty collection effortlessly'
      description='Keep track of your skincare and makeup products with ease – no more wasting time trying to remember what you already have!'
      textButtom='Log in with Google'
      imageUrl={registerLogin}
      closeFunction={handleCloseLogin}
      authMode='login'
    />
  );
};

export { Login };