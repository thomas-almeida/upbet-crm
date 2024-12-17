import { useEffect, useState } from "react"
import { BarChart, Bar, Cell, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function DashChart({
  visible,
  dashData
}) {

  const [chartId, setChartId] = useState("")
  const [chartData, setChartData] = useState([])
  const [currentOrder, setOrder] = useState('')

  function getChartData() {
    const id = localStorage.getItem("chartId")
    setChartId(id)
    if (chartId !== '') {
      const selectedDash = dashData?.find(dash => dash?.id === chartId)
      setChartData(selectedDash)
      setOrder(chartData?.guides?.value)
    }
  }

  function toggleOrder(value) {
    setOrder(value)
  }

  useEffect(() => {
    getChartData()
  }, [chartId, dashData])

  const sortedDash = chartData?.results
    ?.slice()
    ?.sort((a, b) => b[currentOrder] - a[currentOrder])

  const maxTick = Math.max(...(sortedDash?.map((item) => item[currentOrder] || 0) || [0]))

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] h-[85vh] text-center">
          <div>
            <div className="mt-6">
              <p className="text-text text-slate-500 text-sm border-2 rounded-md w-[150px] my-4">Dash ID: {chartData?.id}</p>
              <h1 className="font-semibold text-2xl text-left capitalize">
                {chartData?.name}
              </h1>
            </div>
            <p className="text-left py-1 mt-2">
              Ordenar por
            </p>
            <div className="my-2 flex justify-start items-center">
              <div className="flex justify-start items-center">
                {
                  chartData?.headers?.map((headerOption) => (
                    <div
                      className="border-2 px-2 py-1 mr-2 rounded-md cursor-pointer flex justify-center items-center shadow-sm transition hover:scale-[1.02] hover:border-[#008181]"
                      onClick={() => toggleOrder(headerOption)}
                    >
                      <p className="mx-1">{headerOption}</p>
                      <img src="/trending-up-outline.svg" className="w-[20px] mx-1" alt="" />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="md:h-[550px] overflow-y-auto ">
            <div className="border-2 rounded-md mt-4">
              <ResponsiveContainer
                width={1000}
                height={chartData?.results?.length * 45}
              >
                <BarChart
                  layout="vertical"
                  data={sortedDash}
                  barSize={25}
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
                  <YAxis type="category" width={160} dataKey={chartData?.guides?.label} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey={currentOrder || chartData?.guides?.value}
                    fill="#008181"
                    className="cursor-pointer"
                    activeBar={
                      <Rectangle
                        fill="pink"
                        stroke="blue"
                      />} >
                    <LabelList
                      dataKey={currentOrder || chartData?.guides?.value}
                      position={"insideLeft"}
                      fill="#fff"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}