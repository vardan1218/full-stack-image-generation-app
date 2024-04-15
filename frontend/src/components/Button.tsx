import { MouseEventHandler } from "react";


interface ButtonProps {
    label: string;
    onClick: MouseEventHandler<HTMLButtonElement> 
}


export const ButtonFn = ({label, onClick}: ButtonProps) => {
    return  <button onClick={onClick} type="submit" className="w-full text-white bg-primary-600
     hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300
     font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 
     dark:hover:bg-primary-700 dark:focus:ring-primary-800">{label}</button>
}