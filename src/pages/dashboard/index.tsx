import { Header } from "@/components/Header"
import { ModalOrder } from "@/components/ModalOrder"
import { setupAPIClient } from "@/services/api"
import { canSSRAuth } from "@/utils/canSSRAuth"
import Head from "next/head"
import { useState } from "react"
import { FiRefreshCcw } from "react-icons/fi"

import Modal from 'react-modal'

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
}

interface HomeProps {
  orders: OrderProps[]
}


export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  }
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}



export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || [])
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  Modal.setAppElement('#__next')

  function handleCloseModal() {
    setModalVisible(false)
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/order/detail', {
      params: {
        order_id: id,
      }
    })

    setModalItem(response.data)
    setModalVisible(true);
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put('/order/finish', {
      order_id: id,
    })

    const response = await apiClient.get('/orders');

    setOrderList(response.data);
    setModalVisible(false);
  }

  async function handleRefreshOrders() {
    setLoading(true);
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/orders');

    setOrderList(response.data)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Painel Baguette</title>
      </Head>

      <div className="flex flex-col">
        <Header />
        <main className="flex justify-between flex-col md:mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
          <div className="flex-row flex items-center">
            <h1 className="text-white text-xl items-center justify-center font-bold">Últimos pedidos</h1>
            <button
              className="text-bggreen font-bold p-3 rounded-lg items-center justify-center"
              disabled={loading} onClick={handleRefreshOrders}>
              {loading ? (<FiRefreshCcw className="text-2xl animate-spin text-bggreen" />) : (
                <FiRefreshCcw className="animate-pulse text-2xl text-bggreen" />
              )}
            </button>
          </div>

          <article className="flex flex-col my-3 mx-0">

            {orderList.length === 0 && (
              <span className="text-gray-600 text-base">
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

            {orderList.map(item => (

              <section key={item.id} className="flex flex-col  bg-bgdark mb-5 rounded-md">
                <button className="flex bg-transparent text-xl h-[60px] items-center" onClick={() => handleOpenModalView(item.id)}>
                  <div className="bg-bggreen w-[9px] h-[60px] rounded-s-md mr-5"></div>
                  <span className="text-white items-center justify-center">Mesa {item.table}</span>
                </button>
              </section>

            ))}


          </article>

        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem} />
        )}
      </div>
    </>
  )
}


export const getServerSideProps = canSSRAuth(async (ctx: any) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/orders');

  // const responseFiles = await apiClient.get('/files' ,{
  //   orders:
  // })
  // console.log(response.data)

  return {
    props: {
      orders: response.data,
    }
  }
})