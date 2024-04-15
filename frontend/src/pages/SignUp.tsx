import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Label } from "../components/Label"
import { InputBox } from "../components/InputBox"
import { ButtonFn } from "../components/Button"
import { BottomWarning } from "../components/BottomWarning"


export const Signup = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate  = useNavigate()

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up and create account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div>
                <Label label={"Email"} />
                <InputBox onChange={e => {
                    setEmail(e.target.value)
                }} placeholder={"xyz@gmail.com"} />
              </div>
              <div>
                <Label label={"Username"} />
                <InputBox onChange={e => {  
                    setUsername(e.target.value)
                }} placeholder={"Vardan Wadhwa"} />
              </div>
              <div>
                <Label label={"Password"} />
                <InputBox onChange={e => {
                    setPassword(e.target.value)
                }} placeholder={"..............."} />
              </div>
              <ButtonFn onClick={async () => {
                const response = await axios.post("http://localhost:3000/signup", {
                    email,
                    username,
                    password
                 });
                localStorage.setItem("token", response.data.token)
                navigate('/dalle')
              }} label={"Sign up"}/>
              <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
