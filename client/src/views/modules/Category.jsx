import { useEffect, useState } from "react"
import CountUp from "react-countup"
import CommentModal from "../../components/CommentModal.jsx"
import { ArrowUp, ArrowDown } from 'react-ionicons'
import callendar from "../../utils/callendar.js"
import MultiSelect from "../../components/MultiSelect.jsx"


export default function Category
  ({
    visible,
    userData,
    dashData,
    kpiData,
    campaignData,
    setActiveScreen,
    setCategory,
    category,
    activeScreen,
    refreshData,
    setCommentModalVisible
  }) {

  const [currentMonthReference, setCurrentMonthReference] = useState('')
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])

  function openChart(chartId) {
    setActiveScreen('chart')
    localStorage.setItem('chartId', chartId)
  }

  function openCommentModal() {
    setCommentModalVisible(true)
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

  useEffect(() => {

    function getCampaigns() {

      let campaignIds = []
      const campaigns = campaignData.find((campaignData) => campaignData.referenceMonth === currentMonthReference)

      campaigns?.campaigns?.forEach((campaign) => {
        campaignIds.push({
          id: campaign['Campaing ID'],
          name: campaign['Segmentação']
        })
      })

      setCampaigns(campaignIds)

    }

    getCampaigns()

  }, [currentMonthReference])

  useEffect(() => {

    const filterCampaigns = () => {

      let filteredItems = ''
      let targetData = {}
      let targetCampaigns = []

      const currentCampaignData = campaignData.find((campaignData) => campaignData.referenceMonth === currentMonthReference)
      filteredItems = currentCampaignData

      selectedCampaigns.forEach((id) => {
        currentCampaignData?.campaigns?.forEach((campaign) => {
          if (campaign['Campaing ID'] === id) {
            targetCampaigns.push(campaign)
          }
        })
      })

      targetData = {
        id: currentCampaignData?.id,
        referenceMonth: currentCampaignData?.referenceMonth,
        campaigns: targetCampaigns
      }

      let arr = []
      arr.push(targetData)
      setFilteredCampaigns(arr)

    }

    filterCampaigns()
  }, [selectedCampaigns])

  function sumAllKPI(campaign, indicator) {

    let itemsToSum = []

    campaign.forEach((campaign) => {
      itemsToSum.push(parseInt(campaign[indicator]))
    })

    const sum = itemsToSum.reduce((acc, cv) => acc + cv, 0)
    return sum
  }

  const campaignsToRender = selectedCampaigns.length > 0 ? filteredCampaigns : campaignData

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>.
        <div className="w-[75vw] h-[85vh] text-center">
          <div>
            <h1 className="font-semibold text-2xl text-left mt-6 capitalize">
              {category}
            </h1>
            <p className="text-left py-2">
              Aqui estão todos os dashboards desta categoria
            </p>
          </div>
          <div className="relative">
            <div className={category === 'campaign' ? `flex justify-start items-center mb-4` : 'hidden'}>
              <div className="p-2 text-left">
                {
                  campaignData?.length > 0 ? (
                    <>
                      <p className="font-semibold mb-1">Mês de Referência</p>

                      <select
                        className="py-2 rounded-md border-2 px-2 cursor-pointer w-[180px]"
                        onChange={(e) => setCurrentMonthReference(e.target.value)}
                      >
                        {
                          campaignData?.map((campaign) => (
                            <option value={campaign?.referenceMonth}>
                              {
                                callendar.translateMonth(campaign?.referenceMonth)
                              }
                            </option>
                          ))
                        }
                      </select>
                    </>
                  ) : ''
                }
              </div>

              <div className="p-2 text-left">
                <p className="font-semibold mb-1">Filtrar por Campanhas</p>
                <MultiSelect
                  items={campaigns}
                  onSelectionChange={setSelectedCampaigns}
                />
              </div>

              <div 
                className="absolute right-2 rounded-md border-2 py-2 px-4  cursor-pointer w-[100px] flex justify-center items-center mt-8 hover:text-[#008181] hover:border-[#008181]"
                onClick={() => openCommentModal()}  
              >
                <p className="font-semibold">Ações</p>
              </div>

            </div>

            <div>
              {
                campaignsToRender?.map((data) => (
                  data?.referenceMonth === currentMonthReference &&
                    category === 'campaign' ? (
                    <div
                      className="grid grid-cols-3 justify-start items-center"
                      key={data?.id}
                    >
                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Custo Total
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`R$ ${sumAllKPI(data?.campaigns, 'Custo Total')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Custo Total')}
                            duration={2.5}
                            prefix="R$ "
                            decimals={2}
                            decimal=","
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Clientes impactados
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'Clientes impactados')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Clientes impactados')}
                            duration={2.5}
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Custo Total de Email
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'Custo email')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Custo email')}
                            duration={2.5}
                            prefix="R$ "
                            decimals={2}
                            decimal=","
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Custo Total de SMS
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'Custo SMS')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Custo SMS')}
                            duration={2.5}
                            prefix="R$ "
                            decimals={2}
                            decimal=","
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Depósitos Após 24h
                          </p>
                          <p className="absolute right-0 cursor-pointer rotate-45"
                            data-tooltip-id={`tooltip-${data?.id}`}
                          >
                            {
                              compareMonths(data.referenceMonth, sumAllKPI(data?.campaigns, 'Dep. 24hrs pos campanha'), 'Dep. 24hrs pos campanha') ?
                                <ArrowUp
                                  color={'#008181'}
                                  height="20px"
                                  width="20px"
                                /> :
                                <ArrowDown
                                  color={'#ff0000'}
                                  height="20px"
                                  width="20px"
                                />
                            }
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'Dep. 24hrs pos campanha')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Dep. 24hrs pos campanha')}
                            duration={2.5}
                            prefix="R$ "
                            decimals={2}
                            decimal=","
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Depósitos Após 48h
                          </p>
                          <p className="absolute right-0 cursor-pointer rotate-45"
                            data-tooltip-id={`tooltip-${data?.id}`}
                          >
                            {
                              compareMonths(data.referenceMonth, sumAllKPI(data?.campaigns, 'Dep. 48h pos campanha'), 'Dep. 48h pos campanha') ?
                                <ArrowUp
                                  color={'#008181'}
                                  height="20px"
                                  width="20px"
                                /> :
                                <ArrowDown
                                  color={'#ff0000'}
                                  height="20px"
                                  width="20px"
                                />
                            }
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'Dep. 48h pos campanha')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'Dep. 48h pos campanha')}
                            duration={2.5}
                            prefix="R$ "
                            decimals={2}
                            decimal=","
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className="p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left hidden"
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            FTDs
                          </p>
                          <p className="absolute right-0 cursor-pointer rotate-45"
                            data-tooltip-id={`tooltip-${data?.id}`}
                          >
                            {
                              compareMonths(data.referenceMonth, sumAllKPI(data?.campaigns, 'FTD'), 'FTD') ?
                                <ArrowUp
                                  color={'#008181'}
                                  height="20px"
                                  width="20px"
                                /> :
                                <ArrowDown
                                  color={'#ff0000'}
                                  height="20px"
                                  width="20px"
                                />
                            }
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'FTD')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'FTD')}
                            duration={2.5}
                            separator="."
                          />
                        </h2>
                      </div>

                      <div
                        className={`p-2 border-2 m-2 rounded-md shadow-sm bg-white text-left`}
                      >
                        <div className="relative flex justify-start items-center">
                          <p className="text-sm font-semibold p-1">
                            Custos de Voz
                          </p>
                          <p className="absolute right-0 cursor-pointer rotate-45 hidden"
                            data-tooltip-id={`tooltip-${data?.id}`}
                          >
                            {
                              compareMonths(data.referenceMonth, sumAllKPI(data?.campaigns, 'voiceCost'), 'voiceCost') ?
                                <ArrowUp
                                  color={'#008181'}
                                  height="20px"
                                  width="20px"
                                /> :
                                <ArrowDown
                                  color={'#ff0000'}
                                  height="20px"
                                  width="20px"
                                />
                            }
                          </p>
                        </div>
                        <h2
                          className="text-3xl font-semibold p-2 fadeInUp-animation overflow-clip text-ellipsis whitespace-nowrap cursor-pointer"
                          data-tooltip-content={`${sumAllKPI(data?.campaigns, 'voiceCost')}`}
                        >
                          <CountUp
                            start={0}
                            end={sumAllKPI(data?.campaigns, 'voiceCost')}
                            prefix="R$"
                            decimals={2}
                            decimal=","
                            duration={2.5}
                            separator="."
                          />
                        </h2>
                      </div>
                    </div>
                  ) : ''
                ))
              }
            </div>

            <div className="grid grid-cols-2 justify-start items-center py-10">
              {
                dashData !== undefined ?
                  dashData?.map((dashItem) => (
                    dashItem?.metricLabel === category ? (
                      <div
                        key={dashItem?.id}
                        className="bg-white border-2 text-left p-6 h-[160px] m-2 rounded-md cursor-pointer shadow-sm transition hover:scale-[1.02] hover:border-[#008181] hover:text-[#008181] flex justify-start items-center bg-[url('/grad.png')] bg-cover"
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