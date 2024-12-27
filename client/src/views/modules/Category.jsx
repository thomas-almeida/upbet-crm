import { useEffect, useState } from "react"
import CountUp from "react-countup"
import { useNavigate } from "react-router-dom"

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
                          <p className="text-sm font-semibold p-1">{kpiItem?.name}</p>
                          <h2 className="text-3xl font-semibold p-2 fadeInUp-animation">
                            {
                              kpiItem?.type === 'currency' ? (
                                <CountUp
                                  start={0}
                                  end={kpiItem?.value / 100}
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