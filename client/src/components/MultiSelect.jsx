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

    useEffect(() => {
        textRefs.current.forEach((ref) => {
            if (ref.scrollWidth > ref.parentElement.offsetWidth) {
                ref.classList.add('marquee-effect')
            }
        })
    }, [items])

    useEffect(() => {
        function observeOutsideClicks() {
            if (dropdowRef.current && !dropdowRef.current.contains(event.target)) {
                setVisibleOptions(false)
                setSelectedItems([])
                onSelectionChange([])
            }
        }

        document.addEventListener('mousedown', observeOutsideClicks)

        return () => {
            document.removeEventListener('mousedown', observeOutsideClicks)
        }
    }, [])

    function multiselectLabel(selectedItems) {
        return selectedItems.length > 2
            ? `${selectedItems.length} Selecionadas`
            : selectedItems.join(', ')
    }

    const isItemSelected = (item) => selectedItems.includes(item)

    return (
        <div className="relative w-[300px]" ref={dropdowRef}>
            <button
                className="w-full py-2 px-3 border-2 rounded-md cursor-pointer text-left bg-white"
                onClick={() => toggleVisible()}
            >
                {selectedItems.length > 0 ? multiselectLabel(selectedItems) : `Todas`}
            </button>
            <div className={isVisibleOptions === true ? `absolute z-10 mt-1 w-full bg-white border-2 rounded-md shadow-lg h-[200px] overflow-y-scroll` : `hidden`}>
                {items.map((item) => (
                    <>
                        <label
                            key={item.id}
                            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 overflow-clip text-clip whitespace-nowrapa"
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
    )
}
