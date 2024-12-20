import { useEffect, useState } from 'react'
import { BarChart, Bar, Cell, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'

export default function CBar({
    data,
    color,
    textColor,
    label,
    value,
    headers,
    filter
}) {

    const [currentHeader, setHeader] = useState('')
    const [currentFilterBy, setFilterBy] = useState('')
    const [sortedResults, setSortedResults] = useState('')
    const sortedData = data
        ?.slice()
        ?.sort((a, b) =>b [currentHeader] - a[currentHeader])


    function toggleHeader(header) {
        setHeader(header)
    }

    async function getSortedData(dataResults) {

        if (filter) {
            const filterBy = currentFilterBy ? currentFilterBy : dataResults[0][filter?.label]
            const dataFilteredByLabel = dataResults.filter((dataFiltered) => dataFiltered[filter?.label] === filterBy)
            const newSortedData = await dataFilteredByLabel
                ?.slice()
                ?.sort((a, b) => b[currentHeader] - a[currentHeader])
            setSortedResults(newSortedData)
        }

    }
    const maxTick = Math.max(...(sortedData?.map((item) => item[currentHeader] || 0) || [0]))

    useEffect(() => {
        if (data) {
            getSortedData(data)
        }
    }, [data, filter, currentFilterBy, currentHeader])

    return (
        <>

            {
                headers ? (
                    <div
                        className='p-2 text-left'
                    >
                        <div>
                            <h2>Ordenar Por</h2>
                        </div>
                        <div className='flex justify-start items-center my-1 border relative'>
                            {
                                headers?.map((headerOption, index) => (
                                    <div
                                        key={headerOption[index]}
                                        className='bg-white flex justify-center shadow-sm items-center border-2 px-2 py-1 mr-2 rounded-md cursor-pointer transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181]'
                                        onClick={() => toggleHeader(headerOption)}
                                    >
                                        <img
                                            src="/trending-up-outline.svg"
                                            className='w-[18px] mx-1'
                                        />
                                        <p className='text-md relative top-[-1px]'>{headerOption}</p>
                                    </div>
                                ))
                            }
                            {
                                filter ? (
                                    <div className='p-1 absolute right-2'>
                                        <select className='px-4 py-1 rounded-md border-2 cursor-pointer'>
                                            <option value="">Selecione</option>
                                        </select>
                                    </div>
                                ) : ''
                            }
                        </div>
                    </div>
                ) : ''
            }
            <div className='rounded-lg overflow-y-scroll h-[460px]'>
                <ResponsiveContainer
                    width={1000}
                    height={sortedResults.length * 45}
                >
                    <BarChart
                        barSize={25}
                        layout='vertical'
                        data={sortedResults}
                        margin={{
                            top: 15,
                            right: 30,
                            left: 10,
                            bottom: 15,
                        }}
                    >
                        <CartesianGrid />
                        <XAxis
                            type="number"
                            domain={[0, maxTick]}
                            ticks={[...Array(5)].map((_, i) => Math.ceil((maxTick / 4) * i))}
                        />
                        <YAxis
                            type="category"
                            width={160}
                            dataKey={label}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey={currentHeader || value}
                            fill={color}
                            classname="cursor-pointer"
                            activeBar={
                                <Rectangle
                                    fill='pink'
                                    stroke='blue'
                                />
                            }
                            className="cursor-pointer"
                        >
                            <LabelList
                                dataKey={currentHeader || value}
                                position={"insideLeft"}
                                fill={textColor}
                                className='font-semibold'
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}