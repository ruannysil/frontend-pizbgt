import { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps {
  loading?: boolean;
  children?: ReactNode;
  type?: "button" | "submit";
}


export function Button({ loading, children, type, ...rest }: ButtonProps) {
  return (
    <button
      className="hover:bg-bredClea bg-bgred text-white font-bold p-3 rounded-lg w-full items-center justify-center flex"
      {...rest}
      disabled={loading}>
      {loading ? (<FaSpinner  className="animate-spin not-allowed text-2xl text-white" />) : (

        <a>{children}</a>
      )}
    </button>
  )
}

export function Button2({ loading, children, type, ...rest }: ButtonProps) {
  return (
    <button
      className="hover:bg-bggreenClea bg-bggreen text-colordark font-bold p-3 rounded-lg w-full items-center justify-center flex text-xl"
      {...rest}
      disabled={loading}>
      {loading ? (<FaSpinner className="animate-spin not-allowed text-2xl text-colordark"  />) : (

        <a>{children}</a>
      )}
    </button>
  )
}
