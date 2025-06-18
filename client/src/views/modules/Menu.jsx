import { useEffect, useState } from "react"
import { PersonOutline } from "react-ionicons"
import options from "../../utils/options"
import CountUp from "react-countup"
import InputMask from 'react-input-mask'
import service from "../../service"

export default function Menu({
  transactionsBalance,
  visible,
  userData,
  setActiveScreen,
  setCategory,
  category,
  activeScreen,
  refreshData,
  KYCData,
  FTDData,
  setKYCData,
  setFTDData
}) {

  const [todayDate, setTodayDate] = useState('')
  const [filterDate, setFilter] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [transactionsValue, setTransactionsValue] = useState({
    deposits_count: 0,
    deposits_sum: 0,
    withdraws_count: 0,
    withdraws_sum: 0
  })

  function setItem(activeScreen, category) {
    setActiveScreen(activeScreen)
    setCategory(category)
    console.log(category)
  }

  useEffect(() => {

    if (transactionsBalance !== undefined) {
      setTransactionsValue(transactionsBalance)
    }

  }, [transactionsBalance])

  function isDecimal(value) {
    if (value < 10) {
      return `0${value}`
    }
  }

  useEffect(() => {

    function getTodayDate() {
      const date = new Date()
      const todayDate = `${date.getDate()}/${date.getMonth() + 1 < 10 ? isDecimal(date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}`

      setTodayDate(todayDate)
    }

    getTodayDate()

  }, [todayDate])

  async function getFilterDate() {
    if (filterDate !== '') {
      console.log(filterDate)

      const splitDate = filterDate.split("/")
      const startDate = encodeURIComponent(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} 00:00:00`)
      const endDate = encodeURIComponent(`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} 23:59:59`)
      const response = await service.getTransactionsBalance(startDate, endDate)

      const queryFilterDate = filterDate.split("/")

      const payload = {
        dashId: "hejtxd982",
        targetDate: filterDate
      }

      const updateResponse = await service.getTransactionsByDate(payload)

      const filterKYC = await service.getKYCToday(`${queryFilterDate[2]}-${queryFilterDate[1]}-${queryFilterDate[0]}`)
      const filterFTD = await service.getFTDToday(`${queryFilterDate[2]}-${queryFilterDate[1]}-${queryFilterDate[0]}`)

      console.log(updateResponse)

      setTransactionsValue(response)
      setKYCData(filterKYC.data)
      setFTDData(filterFTD.data)
      setIsFiltering(true)

    }
  }

  async function clearFilter() {

    setFilter('')
    const splitedTodayDate = todayDate.split("/")

    const startDate = encodeURIComponent(`${splitedTodayDate[2]}-${splitedTodayDate[1]}-${splitedTodayDate[0]} 00:00:00`)
    const endDate = encodeURIComponent(`${splitedTodayDate[2]}-${splitedTodayDate[1]}-${splitedTodayDate[0]} 23:59:59`)

    const response = await service.getTransactionsBalance(startDate, endDate)
    const responseKYC = await service.getKYCToday(`${splitedTodayDate[2]}-${splitedTodayDate[1]}-${splitedTodayDate[0]}`)
    const responseFTD = await service.getFTDToday(`${splitedTodayDate[2]}-${splitedTodayDate[1]}-${splitedTodayDate[0]}`)

    setKYCData(responseKYC.data)
    setFTDData(responseFTD.data)
    setTransactionsValue(response)
    setIsFiltering(false)

  }

  useEffect(() => {

    async function getTransactionsToday(dashId) {
      const reponse = await service.getTransactionsToday({
        dashId: dashId
      })
    }

    getTransactionsToday("hejtxd982")

  }, [])

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] text-center h-[85vh]">
          <div>
            <div
              className="text-left mt-4"
            >

              {
                transactionsValue !== undefined ? (
                  <div className="">

                    <div className="flex justify-start items-center pb-4 relative">
                      <h2 className="font-semibold mr-2">Contatos & Visitas</h2>
                      <div className="flex justify-start items-center absolute right-2">
                        <p className="mx-4 font-semibold">Filtrar por data</p>
                        <button
                          className={isFiltering ? "px-2 p-1 border-2 rounded-sm cursor-pointer shadow-sm bg-white hover:transtion hover:scale-[1.05] mr-1" : "hidden"}
                          onClick={() => clearFilter()}
                        >
                          <img
                            src="/close-outline.svg"
                            className="w-[22px]"
                          />
                        </button>
                        <InputMask
                          className="rounded-sm font-semibold shadow-sm border border-[#DDD] p-1 text-center w-[120px] placeholder:px-1 placeholder:font-semibold placeholder:text-[#1c1c1c] outline-[#00818199] mr-2"
                          mask="99/99/9999"
                          placeholder={todayDate}
                          value={filterDate}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                        <button
                          className="px-6 p-1 rounded-sm cursor-pointer shadow-md bg-[#008181] text-white hover:transtion hover:scale-[1.05]"
                          onClick={() => getFilterDate()}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2">

                      <div
                        className="border-2 shadow-sm p-6 bg-white mx-2 cursor-pointer ml-0 rounded-md hover:text-[#008181] hover:border-[#008181] bg-[url('/grad.png')] bg-cover relative"
                        onClick={() => setItem('category', 'transactions')}
                      >

                        <div
                          className="flex justify-start items-center"
                        >
                          <p>Contatos Feitos</p>
                          <p className="text-slate-400 text-sm ml-2">
                            {
                              filterDate !== '' && isFiltering ? filterDate : 'Hoje'
                            }
                          </p>
                        </div>
                        <h3 className="font-semibold text-6xl pt-2 fadeInUp-animation flex justify-start items-center">
                          <PersonOutline
                            color={'#00000'}
                            height="30px"
                            width="30px"
                          />
                          <CountUp
                            end={48}
                            decimals={0}
                          />
                        </h3>

                      </div>

                      <div
                        className="border-2 shadow-sm p-6 bg-white mx-2 cursor-pointer rounded-md hover:text-[#008181] hover:border-[#008181] bg-[url('/grad.png')] bg-cover relative"
                        onClick={() => setItem('category', 'transactions')}
                      >
                        <div
                          className="flex justify-start items-center"
                        >
                          <p>Conversões de Visitas</p>
                          <p className="text-slate-400 text-sm ml-2">
                            {
                              filterDate !== '' && isFiltering ? filterDate : 'Hoje'
                            }
                          </p>
                        </div>
                        <h3 className="font-semibold text-6xl pt-2 fadeInUp-animation flex justify-start items-center">
                          <img src="/swap-outline.svg" className="w-[30px] mr-1" alt="" />
                          <CountUp
                            end={25}
                            decimals={0}
                            prefix=""
                          />
                        </h3>
                      </div>

                    </div>

                  </div>
                ) : (
                  <p>carregando valores</p>
                )
              }

            </div>



            <div className="text-left py-4">

              <h2 className="font-semibold mr-2 pb-4">Visões</h2>

              <div className="grid justify-start grid-cols-2">
                {
                  options.map((option, index) => (
                    <div
                      key={option[index]}
                      className="bg-white border-2 p-4 mx-2 my-2 ml-0 text-left h-[180px] rounded-md shadow-sm relative cursor-pointer transition hover:scale-[1.02] hover:text-[#008181] hover:border-[#008181] bg-[url('/grad.png')] bg-cover"
                      onClick={() => setItem(option.activeScreen, option.category)}
                    >
                      <div className="absolute bottom-4">
                        <img src={option.icon} className="w-[40px] my-2" alt="" />
                        <p>Veja visões de</p>
                        <h3 className="text-2xl font-semibold">
                          {
                            option.name
                          }
                        </h3>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>
        </div>
      </div >
    </>
  )
}