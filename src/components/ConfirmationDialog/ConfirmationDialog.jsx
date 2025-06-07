// components/ConfirmationDialog/ConfirmationDialog.jsx
import React from 'react';
import { IoClose } from 'react-icons/io5';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  message,
  title = 'Confirmar acción',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning' // 'error', 'warning', 'info'
}) => {
  const getHeaderClass = () => {
    const baseClass = 'confirmationDialog__header';
    
    switch (type) {
      case 'error':
        return `${baseClass} ${baseClass}--error`;
      case 'info':
        return `${baseClass} ${baseClass}--info`;
      case 'warning':
      default:
        return baseClass;
    }
  };

  return (
    <div className='confirmationDialog'>
      <div className='confirmationDialog__container'>
        <section className={getHeaderClass()}>
          <h1 className='confirmationDialog__header--title'>{title}</h1>
          <IoClose
            onClick={onCancel}
            size={40}
            className='confirmationDialog__header--icon'
          />
        </section>
        
        <section className='confirmationDialog__content'>
          <p className='confirmationDialog__content--text'>{message}</p>
        </section>
        
        <section className='confirmationDialog__actions'>
          <button 
            onClick={onCancel}
            className='confirmationDialog__button confirmationDialog__button--cancel'
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className='confirmationDialog__button confirmationDialog__button--confirm'
          >
            {confirmText}
          </button>
        </section>
      </div>
    </div>
  );
};

export { ConfirmationDialog };