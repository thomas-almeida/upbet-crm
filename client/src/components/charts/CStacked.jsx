import { useState, useEffect } from "react"
import convertDates from "../../utils/convertDates.js"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import translate from "../../utils/translate.js";
import callendar from "../../utils/callendar.js";

export default function CStacked({
    data,
    color,
    textColor,
    label,
    value,
    headers,
    stackId,
    filter
}) {

    const [currentHeader, setHeader] = useState('')
    const [itemsByMonth, setItemsByMonth] = useState([])
    const [monthsToFilter, setMonthsToFilter] = useState([])
    const [currentMonthReference, setCurrentMonthReference] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const colors = ["#A4A4A4", "#00CC99", "#005151"]

    useEffect(() => {

        function filterByMonth() {

            let dates = []
            data.forEach((items) => {
                const splitedDate = items["event_date"]?.split("-")
                dates.push(`${splitedDate[1]}/${splitedDate[0]}`)
            })

            const uniqueMonths = [...new Set(dates)]
            setMonthsToFilter(uniqueMonths)
        }

        filterByMonth()

    }, [data])

    useEffect(() => {

        function itemsByFilteredMonth() {

            let filter = []
            monthsToFilter.forEach((month) => {
                let splitDate = month.split("/")
                filter.push(data.filter((item) => item["event_date"]?.includes(`${splitDate[1]}-${splitDate[0]}`)))
            })
            setItemsByMonth(filter)
        }

        itemsByFilteredMonth()

    }, [monthsToFilter])

    useEffect(() => {

        function getMonthReference() {

            if (monthsToFilter.length > 0 && itemsByMonth.length > 0) {
                const firstMonthReferenceList = itemsByMonth[0]
                const firstMothReference = firstMonthReferenceList[0]["event_date"]?.split("-")

                setCurrentMonthReference(`${firstMothReference[1]}/${firstMothReference[0]}`)
            }

        }

        getMonthReference()

    }, [itemsByMonth])

    useEffect(() => {

        function getListOfMonth() {

            itemsByMonth.forEach((list, index) => {

                let splitedMonthReference

                if (currentMonthReference != "") {
                    
                    splitedMonthReference = currentMonthReference?.split("/")

                    if (list[index]["event_date"]?.includes(`${splitedMonthReference[1]}-${splitedMonthReference[0]}`)) {
                        setFilteredData(list)
                    }
                }

            })

            console.log(monthsToFilter)

        }


        getListOfMonth()
    }, [currentMonthReference, itemsByMonth])

    function handleSet(e) {
        setCurrentMonthReference(e)
    }

    return (
        <>
            {
                headers ? (
                    <div>
                        <h2>Ordenar por</h2>
                    </div>
                ) : ''
            }
            {
                filter ? (
                    <div className="flex justify-start items-center relative w-full">
                        <div
                            className="text-left"
                        >
                            <div>
                                <h2 className="font-semibold">Por Mês</h2>
                            </div>
                            <select
                                className='px-4 py-1 rounded-md border-2 cursor-pointer outline-[#008181]'
                                onChange={(e) => handleSet(e.target.value)}
                            >
                                <option
                                    value={'Selecione'}
                                    disabled
                                    selected
                                >
                                    Selecione
                                </option>
                                {
                                    monthsToFilter.map((month, index) => (
                                        <option
                                            value={month}
                                            key={index}
                                        >
                                            {
                                                callendar.translateMonth(month)
                                            }
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                ) : ''
            }
            <div>
                <ResponsiveContainer
                    width={"100%"}
                    height={600}
                >
                    <BarChart
                        data={filteredData}
                        barSize={25}
                        margin={{
                            top: 15,
                            right: 30,
                            left: 10,
                            bottom: 15,
                        }}
                    >
                        <CartesianGrid strokeDasharray={'3 3'} />
                        <XAxis
                            dataKey={label}
                            tickFormatter={(date) => translate.translateDates(date)}
                        />
                        <YAxis
                            tickFormatter={(value) => translate.translateNumbers(value)}
                        />
                        <Tooltip
                            labelFormatter={(date) => translate.translateDates(date)}
                        />
                        <Legend />
                        {
                            value?.map((itemValue, index) => (
                                <Bar
                                    key={itemValue[itemValue]}
                                    dataKey={itemValue}
                                    stackId={stackId !== "pill" ? itemValue : stackId}
                                    fill={colors[index]}
                                    className="cursor-pointer"
                                    name={translate.translateItem(itemValue)}
                                    barSize={25}
                                >
                                    <LabelList
                                        dataKey={itemValue}
                                        fill={textColor}
                                        className='font-semibold text-sm'
                                    />
                                </Bar>
                            ))
                        }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}