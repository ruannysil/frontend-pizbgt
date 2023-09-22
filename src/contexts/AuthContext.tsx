import { api } from '@/services/apiClient';
import router, { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  signIn: (credential: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credential: SignUpProps) => Promise<void>
}

type UserProps = {
  id: string;
  name: string;
  email: string
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string;
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')
    router.push('/')
  } catch (err) {
    console.log('Erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const router = useRouter()
  const isAuthenticated = !!user;

  useEffect(() => {
    //tentar pegar ao do cookie
    const { '@nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { id, name, email } = response.data;

        setUser({
          id,
          name,
          email
        })
      }).catch(() => {
        signOut()
      })
    }
  }, [])

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      })
      // console.log(response.data)
      const { id, name, token } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/' // Quais caminhos terao acesso ao cookies
      })

      setUser({
        id,
        name,
        email
      })

      //passa para proxima requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      toast.success('Logado com sucesso!')

      // redirecionar o user para pagina dashboard
      router.push('/dashboard')

    } catch (err) {
      toast.error('Erro ao acessar!')
      console.log('erro ao acessa dados', err)
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = api.post('/users', {
        name,
        email,
        password
      })

      toast.success('Cadastrado criada sucesso!')
      router.push('/');
    } catch (err) {
      toast.error('Error ao cadastra')
      console.log('Erro ao cadastra ', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}