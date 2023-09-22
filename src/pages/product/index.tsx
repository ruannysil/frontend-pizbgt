import { Header } from "@/components/Header";
import { Button2 } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
}

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  // console.log(categoryList)

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('')
  const [imageAvatar, setImageAvatar] = useState<File | null>(null)

  const [categories, setCategories] = useState(categoryList || [])
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.files)
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === 'image/jpeg' || image.type === 'image/png') {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  function handleChangeCategory(e: ChangeEvent<any>) {
    // console.log("Posicao da categoria selecionada", e.target.value)
    // console.log('posicao da categoria ', categories[e.target.value])
    setCategorySelected(e.target.value)
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();
      if (name === "" || price === "" || description === "") {
        toast.error("Preencha todos os campos")
        return;
      }

      data.append('name', name)
      data.append('price', price)
      data.append('description', description)
      data.append('category_id', categories[categorySelected].id)

      if (imageAvatar !== null) {
        data.append('file', imageAvatar);
      }

      setName('')
      setPrice('')
      setDescription('')
      setImageAvatar(null)
      setAvatarUrl('')

      const apiClient = setupAPIClient();
      await apiClient.post('/product', data);

      toast.success('Cadastrado com sucesso!')

    } catch (err) {
      console.log(err)
      toast.error('Ops erro ao cadastrar!')
    }

  }

  return (
    <>
      <Head>
        <title>Novo Produto - Pizzaria Baguette</title>
      </Head>
      <div>
        <Header />

        <main className="m-[4rem auto] flex justify-between flex-col mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
          <h1 className="text-white font-bold text-3xl flex items-start">
            Cadastra novo produto
          </h1>

          <form className="flex flex-col mx-auto my-8  w-full" onSubmit={handleRegister}>

            <label className="w-full h-[280px] bg-colordark mb-4 rounded-md flex justify-center items-center cursor-pointer z-[0] ">
              <span className="z-[99] absolute opacity-[0.7] transform hover:scale-[1.2] hover:opacity-[10]">
                <FiUpload className="text-white text-4xl" />
              </span>

              <Input type="file" accept="image/png image/jpeg" onChange={handleFile} />

              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  width={250}
                  height={250}
                  alt="Foto do produto"
                  style={{ width: '100%', height: "100%", objectFit: 'cover', }}
                />
              )}

            </label>

            <select className="w-full h-[40px] rounded-md mb-5 p-1 text-white bg-colordark border" value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index} >
                    {item.name}
                  </option>
                )
              })}
            </select>

            <Input
              type="text"
              placeholder="Digite o nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Preço do produto"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextArea
              placeholder="Descreva seu produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button2>
              Cadastrar
            </Button2>
          </form>
        </main>
      </div>
    </>
  )
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