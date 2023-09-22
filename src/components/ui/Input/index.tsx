interface InputProps {
  name?: string;
  type?: string;
  value?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function Input({ name, type, value, placeholder, accept, ...rest }: InputProps) {

  const ClassName = type === "file" ? "border-none hidden" : "shadow appearance-none border rounded-lg w-full p-3 text-white leading-tight focus:outline-none bg-bgdark focus:shadow-outline placeholder:text-placeColor flex"
  return (
    <div className="mb-4">
      <input className={ClassName} value={value}  {...rest} type={type} placeholder={placeholder} />
    </div>
  )
}


interface TextAreaProps {
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export function TextArea({
  value,
  placeholder,
  onChange,
  ...rest
}: TextAreaProps) {
  return <textarea className="w-full min-h-[120px] resize-none bg-colordark text-white border rounded-md mb-4 p-2" placeholder={placeholder} value={value} {...rest} onChange={onChange} >
  </textarea> }