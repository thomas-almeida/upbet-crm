import { useState, useRef, useEffect } from 'react'

export default function MultiSelectDropdown({
    items,
    onSelectionChange
}) {
    const [selectedItems, setSelectedItems] = useState([])
    const [isVisibleOptions, setVisibleOptions] = useState(false)
    const dropdowRef = useRef(null)
    const textRefs = useRef([])

    const toggleItem = (item) => {

        const updateSelection = selectedItems.includes(item)
            ? selectedItems.filter((item) => item !== item)
            : [...selectedItems, item]

        setSelectedItems(updateSelection)
        onSelectionChange(updateSelection)
    }

    function toggleVisible() {
        if (isVisibleOptions) {
            setVisibleOptions(false)
        } else {
            setVisibleOptions(true)
        }
    }


    function clearFilter() {
        setVisibleOptions(false)
        setSelectedItems([])
        onSelectionChange([])
    }

    function multiselectLabel(selectedItems) {
        return selectedItems.length > 2
            ? `${selectedItems.length} Selecionadas`
            : selectedItems.join(', ')
    }

    const isItemSelected = (item) => selectedItems.includes(item)

    return (
        <>
            <div className='flex items-center justify-start gap-2'>
                <div className="relative w-[300px]">
                    <button
                        className="w-full py-2 px-3 border-2 rounded-md cursor-pointer text-left bg-white hover:text-[#008181] hover:border-[#008181]"
                        onClick={() => toggleVisible()}
                    >
                        {selectedItems.length > 0 ? multiselectLabel(selectedItems) : `Todas`}
                    </button>
                    <div className={isVisibleOptions === true ? `absolute z-10 mt-1 w-full bg-white border-2 rounded-md shadow-lg h-[200px] overflow-y-scroll` : `hidden`}>
                        {items.map((item) => (
                            <>
                                <label
                                    key={item.id}
                                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100 overflow-clip text-ellipsis whitespace-break-spaces"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isItemSelected(item.id)}
                                        onChange={() => toggleItem(item.id)}
                                        className="mr-2"
                                    />
                                    <p>{item.name}</p>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                <div
                    onClick={() => clearFilter()}
                    className={
                        selectedItems.length > 0 ?
                        `py-2 px-4 border-2 rounded-md cursor-pointer text-left bg-white hover:text-[#008181] hover:border-[#008181]` :
                        `hidden`}>
                    <p>Limpar Filtro</p>
                </div>
            </div>
        </>
    )
}
