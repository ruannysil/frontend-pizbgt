import { FiX } from 'react-icons/fi';
import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';

import { api } from '@/services/apiClient';
import { setupAPIClient } from '@/services/api';





interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  product: ProductDetailsProps;
  handleDeleteProduct: () => void; // Não é necessário passar id aqui
  handleSearchProduct: () => void;
}

export interface ProductDetailsProps {
  id: string;
  name: string;
  banner: string;
  price: string;
  description: string;
}


export function ModalProduct({ isOpen, onRequestClose, product, handleSearchProduct }: ModalOrderProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  async function handleDeleteProduct() {
    const apiClient = setupAPIClient();
    try {
      await apiClient.delete(`/category/product?id=${product.id}`);
      // Chama a função para atualizar a lista de produtos
      handleSearchProduct();
      onRequestClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      // toast.error('Erro ao excluir o produto.');
    }
  }

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const customStyles = {
    overlay: {
      left: '5px',
      right: '5px',
      bottom: 0,
      backgroundColor: 'rgb(29, 29, 46, 0.8)',
      zIndex: 9000,
    },
    content: {
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e',
      maxWidth: '620px',
      width: '100%',
      maxHeight: '620px',
      height: '100%',
      padding: `${windowWidth < 450 ? '12px' : '30px'}`,
      border: '1px solid #ff3f4b ',
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <button type='button' onClick={onRequestClose} className="react-modal-close bg-transparent border-0">
        <FiX className="text-bgred text-5xl" />
      </button>

      <div className='flex flex-col md:w-full'>
        <h2 className='text-white font-bold text-2xl mb-8'>Detalhes do produto</h2>
        {product && (
          <section className='py-3 text-white flex items-center flex-col md:flex-row'>
            <img src={`${api.defaults.baseURL}/files/${product.banner}`} alt={product.name} className='mb-1 md:w-[50%] w-[300px]  rounded-md md:mr-4 mr-0' />
            <div className='flex flex-col gap-2 items-start md:items-start w-[280px]'>
              <span className='flex'>{product.name} - <strong className='text-bgred ml-1'>R$ {product.price}</strong></span>
              <span>{product.description}</span>
            </div>
          </section>
        )}

        <button className='mt-16 bg-bgdark font-bold hover:bg-bggreen text-bgred hover:text-colordark p-3 rounded-md flex items-center justify-center w-[10rem]' onClick={() => handleDeleteProduct()}>
          Excluir Produto
        </button>
      </div>
    </ReactModal>
  )
}
