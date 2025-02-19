import { useState } from "react"

export default function CommentModal({
    isVisible,
    closeModal
}) {


    const [actionList, setActionList] = useState([])

    return (
        <>
            <div
                className={isVisible ? `fixed z-[99999] flex justify-end w-full h-svh items-center bg-[#00000065]` : `hidden`}
            >
                <div className="w-[40%] fadeInUp-animation bg-[#FFF] drop-shadow-2xl p-6 h-svh">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl">Ações</h1>
                            <p className="text-slate-600">Ações de CRM relacionadas a esses dados</p>
                        </div>
                        <button
                            className="p-1 px-4 border-2 rounded-md shadow-sm"
                            onClick={() => closeModal()}
                        >
                            Fechar
                        </button>
                    </div>
                    {
                        actionList.length > 0 ?
                            (
                                <>
                                    <p>aaa</p>
                                </>
                            ) :
                            (
                                <div className="flex justify-center items-center h-svh">
                                    <h2 className="text-2xl text-slate-500">Sem ações cadastradas nesse período</h2>
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    )
}