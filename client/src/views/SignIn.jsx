import { NavLink, useNavigate } from "react-router-dom"
import service from "../service"

import { useState } from "react"

export default function SignIn() {

  const redirect = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userPayload = {
    username: username,
    password: password
  }

  async function signUser(e) {

    e.preventDefault()

    try {

      const response = await service.signIn(userPayload)
      localStorage.setItem('userData', JSON.stringify(response?.userData))
      redirect(`/home?id=${response?.userData?.id}`)

    } catch (error) {
      console.error(error)
    }

  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-[60%] p-4">
          <form
            className="p-2 flex flex-col"
            onSubmit={signUser}
          >

            <input
              type="text"
              placeholder="Nome de Usuário"
              className="p-2 m-2 rounded-sm border-2 shadow-sm text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              className="p-2 m-2 rounded-sm border-2 shadow-sm text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input 
              type="submit" 
              value="Entrar"
              className="p-2 m-2 rounded-sm border-2 shadow-sm text-lg cursor-pointer"
             />

          </form>
        </div>
      </div>
    </>
  )
}