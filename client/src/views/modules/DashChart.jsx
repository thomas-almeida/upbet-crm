import { useEffect, useState } from "react"
import CBar from "../../components/charts/CBar"
import CStacked from "../../components/charts/CStacked"
import CLineChart from "../../components/charts/CLineChart"

export default function DashChart({
  visible,
  dashData
}) {
  const [chartId, setChartId] = useState("")
  const [chartData, setChartData] = useState([])

  function getChartData() {
    const id = localStorage.getItem("chartId")
    setChartId(id)
    if (id !== '') {
      const selectedDash = dashData?.find(dash => dash?.id === id)
      setChartData(selectedDash)
    }
  }

  useEffect(() => {
    getChartData()
  }, [chartId, dashData])

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] h-[85vh] text-center">
          <div>
            <div className="py-4 mt-2 text-left">
              <h1 className="text-2xl font-semibold">{chartData?.name}</h1>
              <p className="text-md">Informações</p>
            </div>
            <div>
              {
                chartData?.chartType === 'bar' &&
                <CBar
                  data={chartData?.results}
                  color={"#008181"}
                  textColor={"#000"}
                  label={chartData?.guides?.label}
                  value={chartData?.guides?.value}
                  headers={chartData?.headers}
                  filter={chartData?.filter}
                />
              }
              {
                chartData?.chartType === 'stacked' &&
                <CStacked
                  data={chartData?.results}
                  color={"#2C2C2C"}
                  textColor={"#000"}
                  label={chartData?.guides?.label}
                  value={chartData?.guides?.value}
                  headers={chartData?.headers}
                  stackId={chartData?.guides?.stackType}
                />
              }
              {
                chartData?.chartType === 'line' &&
                <CLineChart 
                  data={chartData?.results}
                  textColor={"#000"}
                  label={chartData?.guides?.label}
                  value={chartData?.guides?.value}
                  headers={chartData?.headers}
                  filter={chartData?.filter}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
