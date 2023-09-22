import { Header } from "@/components/Header";
import { ModalProduct, ProductDetailsProps } from "@/components/ModalOrder/ModalProduct/indext";
import { setupAPIClient } from "@/services/api";
import { api } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";

import Modal from 'react-modal';

type ItemProps = {
  id: string;
  name: string;
  categoryProducts: ProductDetailsProps;
}

interface CategoryProps {
  categoryList: ItemProps[];
}

// export interface ProductProps {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   banner: string;
//   category_id: string;
// }

export default function Menu({ categoryList }: CategoryProps) {
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState("");
  const [products, setProducts] = useState<ProductDetailsProps[]>([]);

  const [modalItem, setModalItem] = useState<ProductDetailsProps>({ id: '', name: '', banner: '', price: '', description: '' })
  const [modalVisible, setModalVisible] = useState(false)

  Modal.setAppElement('#__next')

  function handleCloseModal() {
    setModalVisible(false)
  }

  async function handleOpenModalView(product: ProductDetailsProps) {
    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.get(`/category/product/`);
      setModalItem(product); // Define o produto selecionado
      setModalVisible(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do produto:', error);
      toast.error('Erro ao buscar detalhes do produto.');
    }
    setModalVisible(true);
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    try {
      await apiClient.delete(`/category/product/${id}`);
      // Atualize o estado de produtos, removendo o produto excluído
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
      toast.error('Erro ao excluir o produto.');
    }

  }

  async function handleChangeCategory(e: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(e.target.value);
  }

  async function handleSearchProduct() {
    if (!categorySelected) {
      toast.error("Selecione uma categoria antes de pesquisar um produto.");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/category/product?category_id=${categorySelected}`);

      // Mapeie os dados para incluir apenas os campos desejados (id, name, price, description)
      const filteredProducts = response.data.map((product: ProductDetailsProps) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        banner: product.banner,
      }));

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Erro ao buscar detalhes dos produtos:', error);
      toast.error('Erro ao buscar detalhes dos produtos.');
    }
  }

  return (
    <>
      <Head>
        <title>Cardápio - Pizzaria Baguette</title>
      </Head>
      <div>
        <Header />

        <main className="m-[4rem auto] flex justify-between flex-col mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
          <h1 className="text-white font-bold md:text-3xl flex items-start mb-4">
            Ver produtos por categorias
          </h1>

          <div className="flex justify-between">
            <select
              className="w-[80%] sm:w-[90%] h-[40px] rounded-md mb-5 p-1 text-white bg-colordark border"
              value={categorySelected}
              onChange={handleChangeCategory}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              className="w-[40px] bg-bggreen items-center justify-center flex h-[40px] rounded-full"
              onClick={handleSearchProduct}
            >
              <BsSearch />
            </button>
          </div>

          <div className="flex justify-between flex-col items-center w-full">
            {products.map((item) => (
              <div key={item.id} className="flex w-full">
                <button className="bg-colordark border border-bgred mb-2 w-full flex sm:mr-4 mr-0 rounded-md" onClick={() => handleOpenModalView(item)}>
                  <img src={`${api.defaults.baseURL}/files/${item.banner}`} className="w-[100px] mr-3 rounded-l-md bg-cover" />
                  <div className="flex flex-col items-start justify-flex w-full">
                    <h2 className="text-white">{item.name}</h2>
                    <p className="text-white">R$ {item.price},00</p>
                    <p className="text-white">{item.description}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </main>

        {modalVisible && (
          <ModalProduct
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            product={modalItem}
            handleDeleteProduct={() => modalItem}
            handleSearchProduct={handleSearchProduct}
          />
        )}
      </div>
    </>
  );
}


export const getServerSideProps = canSSRAuth(async (ctx: any) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/category');

  return {
    props: {
      categoryList: response.data,
    }
  }
});

