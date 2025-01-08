import { useState } from "react"
import service from "../service"

export default function DocForm({ visible, closeModal, userData, setActiveScreen, refreshData }) {
    const [name, setName] = useState("")
    const [details, setDetails] = useState("")
    const [preTag, setPreTag] = useState("")
    const [tags, setTags] = useState([])
    const [file, setFile] = useState("")
    const [selectedFile, setSelectedFile] = useState([])
    const [filename, setFileName] = useState('')

    function addDocumentTag(tag) {
        if (tag.trim() !== "") {
            setTags((prevTags) => [...prevTags, tag.trim()])
            setPreTag("")
        }
    }

    function removeDocumentTag(index) {
        setTags((prevTags) => prevTags.filter((_, i) => i !== index));
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files)
        setFileName(files[0].name)
        setSelectedFile(files[0])
    }

    async function uploadFile() {
        const response = await service.uploadScriptFile(selectedFile)
        return response.data
    }


    function clearInputs() {
        setName('')
        setDetails('')
        setTags([])
        setSelectedFile([])
        setFile('')
        setPreTag('')
        setFileName('')
    }

    async function craeteDocument() {

        const fileResponse = await uploadFile()

        const payload = {
            name: name,
            details: details,
            tags: tags,
            userId: userData.id,
            file: fileResponse
        }

        const response = await service.createScriptDoc(payload)
        console.log(response.data)
        setActiveScreen('docs')
        closeModal(visible)
        clearInputs()
        refreshData(refreshData)
        
    }

    return (
        <>
            <div
                className={
                    visible
                        ? "flex items-center justify-center absolute z-[999] shadow-md rounded-lg bg-[#ffffff]"
                        : "hidden"
                }
            >
                <div className="w-[75vw] h-[75vh] text-left px-36">
                    <div>
                        <div
                            className="flex justify-start items-center mt-6 w-[85px] cursor-pointer"
                            onClick={() => closeModal(visible)}
                        >
                            <img src="/back.svg" className="w-[20px]" />
                            <p className="text-lg ml-2 font-semibold">Voltar</p>
                        </div>
                        <h1 className="text-2xl mt-6 mb-2 font-semibold">Nova Documentação</h1>

                        <div className="flex justify-center items-center">
                            <div className="w-[100%]">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Título da Documentação"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="p-2 text-lg rounded-md border-2 w-full my-1 outline-[#008181]"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Detalhes do Script.."
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        rows={3}
                                        className="w-full border-2 p-2 my-1 rounded-md resize-none text-lg outline-[#008181]"
                                    ></textarea>
                                </div>
                                <div>
                                    <div className="flex justify-center items-center">
                                        <input
                                            type="text"
                                            value={preTag}
                                            placeholder="Adicione uma tag"
                                            onChange={(e) => setPreTag(e.target.value)}
                                            className="w-full p-2 text-lg border-2 rounded-md outline-[#008181]"
                                        />
                                        <button
                                            className="w-[200px] border-2 rounded-md ml-1 py-2 text-lg text-white bg-[#008181]"
                                            onClick={() => addDocumentTag(preTag)}
                                        >
                                            Adicionar Tag
                                        </button>
                                    </div>
                                    <ul className="py-1 flex justify-start items-center">
                                        {tags.map((tag, index) => (
                                            <li
                                                key={index} className="text-md font-semibold border p-1 px-2 mr-1 rounded-md shadow-sm cursor-pointer text-[#008181]"
                                                onClick={() => removeDocumentTag(index)}
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-lg my-2 flex justify-center items-center">
                                        <label
                                            htmlFor="script-file"
                                            className="cursor-pointer w-full text-center p-4 py-6 border-dashed border-2 rounded-md hover:border-[#008181]"
                                        >
                                            {
                                                filename !== ''
                                                    ? (<p>Você Selecionou:  <b className="text-[#008181]">{filename}</b></p>)
                                                    : (<p>Arraste o arquivo aqui ou, <b className="text-[#008181]">Escolha do Computador</b></p>)
                                            }
                                        </label>
                                    </div>
                                    <input
                                        type="file"
                                        value={file}
                                        id="script-file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div>
                                    <button
                                        className="p-2 py-3 border-2 text-lg rounded-md w-full bg-[#008181] text-white"
                                        onClick={() => craeteDocument()}
                                    >
                                        Criar nova documentação
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
