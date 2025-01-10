import { useEffect, useState } from "react"
import CountUp from "react-countup"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { ArrowUp, ArrowDown } from 'react-ionicons'

export default function Category({
  visible,
  userData,
  dashData,
  kpiData,
  campaignData,
  setActiveScreen,
  setCategory,
  category,
  activeScreen,
  refreshData
}) {

  const [currentMonthReference, setCurrentMonthReference] = useState('')

  function openChart(chartId) {
    setActiveScreen('chart')
    localStorage.setItem('chartId', chartId)
  }

  function compareMonths(currentDate, value, label) {

    let previousDate = currentDate.split('/')
    let previousMonth = parseInt(previousDate[0]) - 1
    let previousyear = parseInt(previousDate[1])

    if (previousMonth === 0) {
      previousMonth = 12
      previousyear = parseInt(previousDate[1] - 1)
    }

    let fullPreviousDate = `${previousMonth}/${previousyear}`
    let prevKPI = kpiData.find((kpi) => kpi.date === fullPreviousDate && kpi.label === label)

    if (prevKPI === undefined) {
      return
    }

    return value >= prevKPI.value ? true : false

  }

  useEffect(() => {
    function getMonthReference() {
      if (campaignData?.length > 0) {
        const firstMonthReference = campaignData[0].referenceMonth
        setCurrentMonthReference(firstMonthReference)
      }
    }

    getMonthReference()
  }, [])

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] h-[85vh] text-center">
          <div>
            <h1 className="font-semibold text-2xl text-left mt-6 capitalize">
              {category}
            </h1>
            <p className="text-left py-2">
              Aqui estão todos os dashboards desta categoria
            </p>
          </div>
          <div>
            {
              campaignData?.length > 0 ? (
                <div className="p-2 text-left">
                  <p className="font-semibold mb-1">Mês de Referência</p>
                  <select
                    className="p-1 rounded-md border-2 px-2 cursor-pointer w-[140px]"
                    onChange={(e) => setCurrentMonthReference(e.target.value)}
                  >
                    {
                      campaignData?.map((campaign) => (
                        <option value={campaign?.referenceMonth}>
                          {campaign?.referenceMonth}
                        </option>
                      ))
                    }
                  </select>
                </div>
              ) : ''
            }
            <div className="grid grid-cols-4 justify-start items-center">
              {

                kpiData?.map((kpiItem) => (
                  kpiItem?.category === category ? (
                    kpiItem?.date === currentMonthReference ?
                      (
                        <div
                          key={kpiItem?.id}
                          className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                        >
                          <div className="flex justify-start items-center relative">
                            <p className="text-sm font-semibold p-1">{kpiItem?.name}</p>
                            <p className="absolute right-0 cursor-pointer rotate-45"
                              data-tooltip-id={`tooltip-${kpiItem?.id}`}
                              data-tooltip-content={
                                compareMonths(kpiItem?.date, kpiItem?.value, kpiItem?.label) ?
                                  "Acima do mês anterior" :
                                  "Abaixo do mês anterior"
                              }
                            >
                              {
                                compareMonths(kpiItem?.date, kpiItem?.value, kpiItem?.label) ?

                                  <ArrowUp
                                    color={kpiItem.label.includes('Custo') ? '#ff0000' : '#008181'}
                                    height="20px"
                                    width="20px"
                                  /> :
                                  <ArrowDown
                                    color={kpiItem.label.includes('Custo') ? '#008181' : '#ff0000'}
                                    height="20px"
                                    width="20px"
                                  />
                              }
                            </p>
                          </div>

                          <h2
                            className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                            data-tooltip-id={`tooltip-${kpiItem?.id}`}
                            data-tooltip-content={
                              kpiItem?.type === 'currency'
                                ? `R$ ${kpiItem?.value.toFixed(2).replace('.', ',')}`
                                : kpiItem?.value
                            }
                          >
                            {
                              kpiItem?.type === 'currency' ? (
                                <CountUp
                                  start={0}
                                  end={kpiItem?.value}
                                  duration={2.5}
                                  prefix="R$ "
                                  decimals={2}
                                  decimal=","
                                  separator="."
                                />
                              ) : (
                                <CountUp
                                  start={0}
                                  end={kpiItem?.value}
                                  duration={0.5}
                                  separator="."
                                />
                              )
                            }
                          </h2>
                          <ReactTooltip id={`tooltip-${kpiItem?.id}`} place="bottom" />
                        </div>
                      ) : ''
                  ) : ''
                ))
              }
            </div>

            <div className="grid grid-cols-4 justify-start items-center py-10">
              {
                dashData !== undefined ?
                  dashData?.map((dashItem) => (
                    dashItem?.metricLabel === category ? (
                      <div
                        key={dashItem?.id}
                        className="bg-white border-2 text-left p-6 w-[250px] h-[160px] m-2 rounded-md cursor-pointer shadow-sm transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181] flex justify-start items-center"
                        onClick={() => openChart(dashItem?.id)}
                      >
                        <div>
                          <img src="/trending-up-outline.svg" className="w-[40px] p-1" alt="" />
                          <b className="text-slate-400 font-medium text-sm">ID: {dashItem?.id}</b>
                          <br />
                          <h2 className="font-semibold py-2 text-lg">
                            {dashItem?.name}
                          </h2>
                        </div>
                      </div>
                    ) : ''
                  )) : ''
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}