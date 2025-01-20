import { useState } from "react"
import convertDates from "../../utils/convertDates.js"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import translate from "../../utils/translate.js";

export default function CStacked({
    data,
    color,
    textColor,
    label,
    value,
    headers,
    stackId
}) {

    const [currentHeader, setHeader] = useState('')
    const colors = ["#8d8d8d", "#009191", "#005151"]


    return (
        <>
            {
                headers ? (
                    <div>
                        <h2>Ordenar por</h2>
                    </div>
                ) : ''
            }
            <div>
                <ResponsiveContainer
                    width={"100%"}
                    height={600}
                >
                    <BarChart
                        data={data}
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