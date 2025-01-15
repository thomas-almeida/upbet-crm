
export default function DocViewer({
    document,
    visible,
    closeViewer
}) {


    return (
        <div className={visible === true ? 'flex items-center justify-center absolute z-[999] shadow-md rounded-lg bg-[#ffffff]' : 'hidden'}>
            <div className="w-[75vw] h-[75vh] px-12 py-8 text-left">
                <div
                    className="flex justify-start items-center mb-6 w-[85px] cursor-pointer"
                    onClick={() => closeViewer(visible)}
                >
                    <img
                        src="/back.svg"
                        className="w-[20px]"
                    />
                    <p
                        className="text-lg ml-2 font-semibold"
                    >
                        Voltar
                    </p>
                </div>
                <div className="flex justify-start items-center mt-1 mb-4">
                    <div className="flex justify-start items-center mr-1">
                        <img
                            src={document?.owner?.profile}
                            className="w-[25px] rounded-full shadow-md mr-1"
                        />
                        <p className="font-semibold text-md">{document?.owner?.name}</p>
                    </div>
                    <p className="mx-2">|</p>
                    <ul className="flex justify-start items-center">
                        {
                            document?.tags?.map((tag) => (
                                <li className="px-2 border shadow-sm mx-1 rounded-md">{tag}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        value={document?.name}
                        className="bg-transparent text-4xl font-semibold outline-none"
                    />
                </div>

                <div>
                    <textarea
                        value={document?.details}
                        className="bg-transparent w-full outline-none text-lg resize-none"
                        rows={6}
                    ></textarea>
                </div>
                <h3 className="font-semibold text-xl mb-1">Script</h3>
                <div
                    className="border-2 border-slate-300 p-2 flex justify-center items-center max-w-[300px] rounded-md shadow-sm cursor-pointer"
                >
                    <img
                        src="/docs.svg"
                        className="w-[25px] mr-1"
                    />
                    <p className="font-semibold text-md">{document?.file?.filename}</p>
                </div>
            </div>
        </div>
    )
}