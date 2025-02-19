import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import callendar from "../../utils/callendar.js"
import translate from "../../utils/translate.js"

export default function CLineChart({
    data,
    label,
    value,
    headers,
    filter,
    setCommentModalVisible
}) {

    const [monthsToFilter, setMonthsToFilter] = useState([])
    const [itemsByMonth, setItemsByMonth] = useState([])
    const [currentMonthReference, setCurrentMonthReference] = useState('')
    const [currentYearReference, setCurrentYearReference] = useState('')
    const [filteringBy, setFilteringBy] = useState('A')
    const [filteredData, setFilteredData] = useState([])
    const [filteredYears, setFilteredYears] = useState([])

    const colors = ["#009191", "#ff0000e0"]

    const isDecimal = (value) => {
        return value < 10 ? `0${value}` : value
    }

    useEffect(() => {

        function filterByMonth() {

            let dates = []
            data.forEach((items) => {
                const splitedDate = items?.date?.split("-")
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
                filter.push(data.filter((item) => item?.date?.includes(`${splitDate[1]}-${splitDate[0]}`)))
            })

            setItemsByMonth(filter)
        }

        itemsByFilteredMonth()

    }, [monthsToFilter])

    useEffect(() => {

        function getMonthReference() {

            if (monthsToFilter.length > 0 && itemsByMonth.length > 0) {
                const firstMonthReferenceList = itemsByMonth[0]
                const firstMothReference = firstMonthReferenceList[0]?.date?.split("-")

                setCurrentMonthReference(`${firstMothReference[1]}/${firstMothReference[0]}`)
            }
        }

        getMonthReference()

    }, [itemsByMonth])

    useEffect(() => {

        function getListOfMonth() {

            if (currentMonthReference !== '') {

                const listOfMonths = itemsByMonth.find((list) => {
                    const splitedMonthReference = currentMonthReference?.split("/")
                    return list.some((item) => item?.date?.includes(`${splitedMonthReference[1]}-${splitedMonthReference[0]}`))
                })

                setFilteredData(listOfMonths || [])

            }

        }

        getListOfMonth()
    }, [currentMonthReference, itemsByMonth])

    useEffect(() => {
        function getAllYear() {

            let years = []
            monthsToFilter.forEach((month) => {
                let splitedDate = month.split("/")
                const year = splitedDate[1]

                years.push(year)
            })

            const filteredYears = [...new Set(years)]

            setFilteredYears(filteredYears)
        }

        getAllYear()

    }, [monthsToFilter])

    useEffect(() => {
        function filterByYear() {

            const selectedMonthsByYear = itemsByMonth.filter((month) => {
                return month.some((day) => day?.date?.includes(currentYearReference))
            })

            const transactionsByMonth = selectedMonthsByYear.map((month) => {
                let deposits = 0
                let withdraws = 0

                const firstValidDay = month.find((day) => day?.date)
                if (!firstValidDay) return null

                const [year, monthNumber] = firstValidDay.date.split('-')

                month.forEach((day) => {
                    deposits += day.deposits_sum || 0
                    withdraws += day.withdraws_sum || 0
                })

                return {
                    date: callendar.getMonthById(Number(monthNumber)),
                    deposits_sum: deposits,
                    withdraws_sum: withdraws,
                }
            }).filter(Boolean)

            setFilteredData(transactionsByMonth)
        }

        filterByYear()
    }, [itemsByMonth, currentYearReference])

    function handleSet(e) {
        if (e?.includes("/")) {
            setCurrentMonthReference(e)
            setFilteringBy('A')
        } else {
            setCurrentYearReference(e)
            setFilteringBy('B')
        }
    }

    return (
        <>
            <div className="relative flex justify-start items-center mb-1">
                {
                    headers ? (
                        <>
                            <div className="text-left hidden">
                                <div>
                                    <h2 className="font-semibold">Ordenar por</h2>
                                </div>
                                <div className="flex justify-start items-center my-1">
                                    {
                                        headers?.map((headerOption, index) => (
                                            <div
                                                key={headerOption[index]}
                                                className='bg-white flex justify-center shadow-sm items-center border-2 px-2 py-1 mr-2 rounded-md cursor-pointer transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181]'
                                            >
                                                <img
                                                    src="/trending-up-outline.svg"
                                                    className='w-[18px] mx-1'
                                                />
                                                <p className='text-md relative top-[-1px]'>{headerOption}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </>
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
                            <div
                                className="text-left mx-4"
                            >
                                <div>
                                    <h2 className="font-semibold">Por Ano</h2>
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
                                        filteredYears.map((year, index) => (
                                            <option
                                                key={index}
                                                value={year}
                                            >
                                                {year}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="absolute right-10 text-right">
                                <div>
                                    <p>Vendo</p>
                                    <h2 className="text-2xl font-semibold text-[#008181]">
                                        {
                                            currentMonthReference !== ''
                                                && filteringBy === 'A'
                                                ? callendar?.translateMonth(currentMonthReference)
                                                : `Ano de ${currentYearReference}`
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
                <div
                    className="rounded-md mr-6 border-2 py-2 px-4 cursor-pointer w-[100px] flex justify-center items-center mt-8 hover:text-[#008181] hover:border-[#008181]"
                    onClick={() => setCommentModalVisible(true)}
                >
                    <p className="font-semibold">Ações</p>
                </div>
            </div>
            <div className="mt-4">
                <ResponsiveContainer
                    width={"100%"}
                    height={600}
                >
                    <LineChart
                        data={filteredData}
                        margin={{
                            top: 15,
                            right: 30,
                            left: 10,
                            bottom: 15,
                        }}
                    >
                        <CartesianGrid strokeDasharray={"3 3"} />
                        <XAxis
                            dataKey={label}
                            tickFormatter={(date) => translate.translateDates(date)}
                        />
                        <YAxis
                            tickFormatter={(value) => translate.translateNumbers(value)}
                        />
                        <Tooltip
                            labelFormatter={(date) => translate.translateDates(date)}
                            formatter={(value, name) => {
                                translate.translateNumbers(value)
                                translate.translateItem(name)
                            }}
                        />
                        <Legend />
                        {
                            value.map((itemValue, index) => (
                                <Line
                                    dataKey={itemValue}
                                    name={translate.translateItem(itemValue)}
                                    formatter={(value) => `R$ ${translate.translateNumbers(value)}`}
                                    stroke={colors[index]}
                                    activeDot={{ r: 9 }}
                                />
                            ))
                        }
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}