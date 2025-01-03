import { useState } from "react"
import DocViewer from "./DocViewer"
import DocForm from "../../components/DocForm"

export default function Docs({
    visible,
    userData,
    docsData,
    setActiveScreen,
    activeScreen,
    refreshData
}) {

    const [viewerVisible, setViewerVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [currentDoc, setCurrentDoc] = useState('')


    function openViewer(document) {
        setCurrentDoc(document)
        setViewerVisible(true)
    }

    function closeViewer(visible) {
        if (visible === true) {
            setViewerVisible(false)
        }
    }

    function closeModal(visible) {
        if (visible === true) {
            setModalVisible(false)
        }
    }

    return (
        <>
            <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
                <div className="w-[75vw] h-[85vh] text-center">
                    <h1 className="font-semibold text-2xl text-left mt-6 capitalize relative">
                        Documentos
                    </h1>
                    <p className="text-left py-2">
                        Informações uteis e documentações do marketing
                    </p>
                    <div className="mt-2">
                        <div 
                            className="flex justify-center items-center bg-white border-2 p-2 w-[230px] rounded-md cursor-pointer shadow-sm transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181] text-left"
                            onClick={() => setModalVisible(true)}
                        >
                            <img
                                src="/docs.svg"
                                className="w-[25px] mr-1"
                            />
                            <h2 className="text-lg font-semibold">Nova Documentação</h2>
                        </div>
                    </div>
                    <div className="py-2 mt-4">
                        <h2 className="text-left text-xl mb-2 font-semibold">
                            Scripts
                        </h2>

                        <div className="grid grid-cols-3">
                            {
                                docsData.map((document) => (
                                    <div 
                                        onClick={() => openViewer(document)}
                                        className="border-2 rounded-md bg-white p-4 w-[300px] mx-2 text-left cursor-pointer shadow-sm transition hover:scale-[1.02] hover:border-[#008181]"
                                    >
                                        <h3 className="text-xl w-[160px] mt-2 font-semibold">{document.name}</h3>
                                        <p className="w-[145px] text-ellipsis overflow-hidden whitespace-nowrap">{document.details}</p>
                                        <ul className="py-2 flex justify-start items-center">
                                            {
                                                document.tags.map((tag) => (
                                                    <li className="px-2 mr-1 border-2 rounded-full shadow-md">{tag}</li>
                                                ))
                                            }
                                        </ul>
                                        <div className="mt-4 flex justify-start items-center">
                                            <img
                                                src={document.owner.profile}
                                                className="w-[30px] rounded-full mr-2 shadow-md"
                                            />
                                            <h3>por <b>{document.owner.name}</b></h3>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DocViewer 
                document={currentDoc}
                visible={viewerVisible} 
                closeViewer={closeViewer}
            />
            <DocForm 
                visible={modalVisible}
                closeModal={closeModal}
                userData={userData}
            />
        </>
    )
}