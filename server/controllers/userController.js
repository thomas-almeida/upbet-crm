import idGenerator from "../utils/idGenerator.js"
import decodes from "../utils/decodes.js"
import chimpers from "../utils/chimpers.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const usersDB = path.join(__dirname, '..', 'db', 'users.json')

let users = []

async function signUp(req, res) {
  try {

    const { name, username, password, role } = req.body
    const data = fs.readFileSync(usersDB, 'utf-8')
    users = data ? JSON.parse(data) : []

    const userExist = users.some(user => user.username === username)

    if (userExist) {
      return res.status(200).json({
        message: 'este usuário já existe..'
      })
    }

    const newUser = {
      id: idGenerator.generateExtensiveId(users),
      name,
      username,
      password: decodes.encrypt(password),
      role,
      profile: chimpers[Math.floor(Math.random() * chimpers.length)]
    }

    users.push(newUser)

    fs.writeFileSync(usersDB, JSON.stringify(users, null, 2))
    console.log(`user ${newUser.username} has been created`)
    return res.status(200).json({
      message: 'success',
      data: newUser
    })

  } catch (error) {
    console.error(error)
  }
}

async function signIn(req, res) {
  try {

    const { username, password } = req.body
    const data = fs.readFileSync(usersDB, 'utf-8')
    users = data ? JSON.parse(data) : []

    const userRegistered = users.find(user => user.username === username && user.password === decodes.encrypt(password))

    if (userRegistered) {
      console.log(`user ${userRegistered.username} has logged in`)
      return res.status(200).json({
        message: 'success',
        userData: userRegistered
      })
    }

    return res.status(200).json({
      message: 'error'
    })

  } catch (error) {
    console.error(error)
  }
}

async function getUserById(req, res) {
  try {

    const id = req.params.id
    const data = fs.readFileSync(usersDB, 'utf-8')
    users = data ? JSON.parse(data) : []

    const user = users.find(user => user.id === id)

    if (user) {
      res.status(200).json({
        message: 'success',
        userData: user
      })
    }else {
      return res.status(200).json({
        message: 'usuario nao encontrado'
      })
    }

  } catch (error) {
    console.error(error)
    res.status(200).json({
      message: 'erro ao trazer usuarios'
    })
  }
}

export default {
  signUp,
  signIn,
  getUserById
}