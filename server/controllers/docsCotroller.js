import idGenerator from "../utils/idGenerator.js"
import decodes from "../utils/decodes.js"
import chimpers from "../utils/chimpers.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDB = path.join(__dirname, '..', 'db', 'docs.json')
const usersDB = path.join(__dirname, '..', 'db', 'users.json')

let docs = []
let users = []

async function uploadFile(req, res) {

    console.log('>> upload')
    // Verifica se o arquivo foi enviado
    const file = req.file
    if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' })
    }

    console.log('Arquivo recebido:', file)

    try {

        res.status(200).json({
            message: 'success',
            data: file
        })

    } catch (err) {
        console.error(err)
    }

}

async function createScriptDoc(req, res) {
    try {

        const { name, details, tags, file, userId } = req.body

        const docsData = fs.readFileSync(docsDB, 'utf-8')
        const usersData = fs.readFileSync(usersDB, 'utf-8')

        docs = docsData ? JSON.parse(docsData) : []
        users = usersData ? JSON.parse(usersData) : []

        const ownerUser = users.find((user) => user.id === userId)

        let newScriptDoc = {
            id: idGenerator.generateExtensiveId(docs),
            name: name,
            details: details,
            tags: tags,
            file: file,
            owner: {
                id: ownerUser?.id,
                name: ownerUser?.name,
                profile: ownerUser?.profile
            }
        }

        docs.push(newScriptDoc)

        res.status(200).json({
            message: 'success',
            data: newScriptDoc
        })

        fs.writeFileSync(docsDB, JSON.stringify(docs, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function downlaodFiles(req, res) {
    const fileName = req.params.filename
    const filePath = path.join(__dirname, 'uploads', fileName)

    res.download(filePath, fileName, (err) => {
        if (err) {
            res.status(500).send('Erro ao baixar o arquivo.')
        }
    })
}

async function getScriptDocs(req, res) {
    try {

        const docsData = fs.readFileSync(docsDB, 'utf-8')
        docs = docsData ? JSON.parse(docsData) : []

        res.status(200).json({
            message: 'success',
            data: docs
        })

    } catch (err) {
        console.error(err)
    }
}

export default {
    createScriptDoc,
    uploadFile,
    downlaodFiles,
    getScriptDocs
}

