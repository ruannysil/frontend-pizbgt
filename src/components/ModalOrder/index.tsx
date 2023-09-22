import { OrderItemProps } from '@/pages/dashboard';
import { api } from '@/services/apiClient';
import { FiX } from 'react-icons/fi';
import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
  handleFinishOrder: (id: string) => void;
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  useEffect(() => {
    const calculateTotalPrice = order.reduce((total, item) => {
      const itemTotal = item.amount * parseFloat(item.product.price);
      return total + itemTotal;
    }, 0)
    setTotalPrice(calculateTotalPrice)
  }, [order])


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
        <h2 className='text-white font-bold text-2xl'>Detalhes do pedido</h2>
        <span className='text-white py-2 text-xl font-bold'>
          Mesa: {order[0].order.table}
        </span>
        {order.map(item => (
          <section key={item.id} className='py-3 text-white flex items-center'>
            <img src={`${api.defaults.baseURL}/files/${item.product.banner}`} alt={item.product.name} className='mb-1 w-[80px] rounded-md mr-4' />
            <div className='flex flex-col gap-2'>
              <span className='flex'>{item.amount} - <strong className='text-bgred ml-1'>{item.product.name}</strong></span>
              <span>R$ {item.product.price},00</span>
              <span>{item.product.description}</span>
              <span>Subtotal: R$ {(item.amount * parseFloat(item.product.price)).toFixed(2)}</span>
            </div>
          </section>
        ))}

        <span className="text-white mt-16 font-bold">Total do Pedido: <strong className='text-bgred'>R$ {totalPrice.toFixed(2)}</strong></span>

        <button className='mt-16 bg-bgdark font-bold hover:bg-bggreen text-bgred hover:text-colordark p-3 rounded-md flex items-center justify-center w-[10rem]' onClick={() => handleFinishOrder(order[0].order_id)}>
          Concluir pedido
        </button>
      </div>
    </ReactModal>
  )
}
