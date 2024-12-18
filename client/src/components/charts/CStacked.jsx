import { useState } from "react"
import convertDates from "../../utils/convertDates.js"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CStacked({
    data,
    color,
    textColor,
    label,
    value,
    headers
}) {

    const [currentHeader, setHeader] = useState('')
    const colors = ["#008181", "#8d8d8d"]

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
                    width={1000}
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
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {
                            value?.map((itemValue, index) => (
                                <Bar
                                    key={itemValue[itemValue]}
                                    dataKey={itemValue}
                                    stackId={itemValue}
                                    fill={colors[index]}
                                >
                                    <LabelList
                                        dataKey={itemValue}
                                        fill={textColor}
                                        className='font-semibold'
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