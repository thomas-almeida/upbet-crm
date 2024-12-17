import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Category({
  visible,
  userData,
  dashData,
  setActiveScreen,
  setCategory,
  category,
  activeScreen,
  refreshData
}) {

  function openChart(chartId) {
    setActiveScreen('chart')
    localStorage.setItem('chartId', chartId)
  }

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
          <div className="flex justify-start items-center py-10">
            {
              dashData !== undefined ?
                dashData?.map((dashItem) => (
                  dashItem?.metricLabel === category ? (
                    <div
                      key={dashItem?.id}
                      className="border-2 text-left p-6 w-[300px] h-[160px] m-2 rounded-md cursor-pointer shadow-md transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181] flex justify-start items-center"
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
    </>
  )
}