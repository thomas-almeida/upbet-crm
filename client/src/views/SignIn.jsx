import { NavLink, useNavigate } from "react-router-dom"
import service from "../service"

import { useState } from "react"

export default function SignIn() {

  const redirect = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  const userPayload = {
    username: username,
    password: password
  }

  async function signUser(e) {

    e.preventDefault()

    try {

      const response = await service.signIn(userPayload)

      if (response.message !== 'error') {
        localStorage.setItem('userData', JSON.stringify(response?.userData))
        redirect(`/home?id=${response?.userData?.id}`)
      }

      setErrorMessage(true)


    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#ffffff]">
        <div className="w-[35%] p-4">
          <form
            className="p-2 flex flex-col"
            onSubmit={signUser}
          >

            <div className="flex justify-center items-center my-4 flex-col">
              <img
                src="/logo.png"
                className="w-[200px]"
              />
              <b className="italic text-slate-400">CRM</b>
            </div>

            <input
              type="text"
              placeholder="Nome de Usuário"
              className="p-2 m-2 rounded-md border-2 shadow-sm text-lg outline-[#008181]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              className="p-2 m-2 rounded-md border-2 shadow-sm text-lg outline-[#008181]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="submit"
              value="Entrar"
              className="p-2 m-2 rounded-md shadow-sm text-lg cursor-pointer transition hover:scale-[1.02] bg-[#098679] text-white font-semibold"
            />

            <div className={errorMessage ? 'text-center my-4' : 'hidden'}>
              <p className="text-red-500 font-semibold">Usuário, ou senha incorretos</p>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}