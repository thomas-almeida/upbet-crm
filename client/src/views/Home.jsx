import { useEffect, useState } from "react"
import Sidebar from "../components/SideBar"
import Screens from "./modules/Screens"
import Breadcrumb from "../components/Breadcrumb"
import { useNavigate } from "react-router-dom"
import service from "../service"
import CommentModal from "../components/CommentModal"

export default function Home() {

  const redirect = useNavigate()
  const [dashData, setDashData] = useState('')
  const [kpiData, setKPIData] = useState('')
  const [docsData, setDocsData] = useState('')
  const [userData, setUserData] = useState('')
  const [campaignData, setCampaignData] = useState('')
  const [activeScreen, setActiveScreen] = useState('menu')
  const [category, setCategory] = useState('')
  const [transactionsBalance, setTransactionsBalance] = useState('')
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [KYCData, setKYCData] = useState(0)
  const [FTDData, setFTDData] = useState(0)

  async function getUserData() {

    let url = window.location
    let userId = new URLSearchParams(url.search).get('id')
    const response = await service.getUserById(userId)
    setUserData(response?.userData)

  }

  async function getDashData() {
    const response = await service.getDashData()
    setDashData(response?.dashData)
  }

  async function getKPIData() {
    const response = await service.getKPIs()
    setKPIData(response.data)
  }

  async function getCampaingData() {
    const response = await service.getAllCampaings()
    setCampaignData(response.data)
  }

  async function getDocsData() {
    const response = await service.getDocsData()
    setDocsData(response.data)
  }

  async function getTransactionsBalance() {
    const date = new Date()

    const todayStartDate = encodeURIComponent(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`)
    const todayEndDate = encodeURIComponent(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 23:59:59`)

    const response = await service.getTransactionsBalance(todayStartDate, todayEndDate)
    setTransactionsBalance(response)
  }

  async function getKYCData() {
    const response = await service.getKYCToday()
    setKYCData(response.data)
  }

  async function getFTDData() {
    const response = await service.getFTDToday()
    setFTDData(response.data)
  }

  async function refreshData() {
    await getTransactionsBalance()
    await getKYCData()
    await getFTDData()
    await getUserData()
    await getDashData()
    await getKPIData()
    await getCampaingData()
    await getDocsData()
  }

  useEffect(() => {
    getKYCData()
    getFTDData()
    getTransactionsBalance()
    getUserData()
    getDashData()
    getKPIData()
    getCampaingData()
    getDocsData()
  }, [])

  function closeCommentModal() {
    setCommentModalVisible(false)
  }

  return (
    <>

      <CommentModal
        isVisible={commentModalVisible}
        closeModal={closeCommentModal}
      />

      <div className="p-2 font-[SF Pro Display]">
        <div className="flex justify-center items-center p-2">
          <div clas>
            <Sidebar
              userData={userData}
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              setCategory={setCategory}
              category={category}
              refreshData={refreshData}
            />
          </div>
          <div className="flex justify-center flex-col items-center h-[95vh] w-full">
            <Breadcrumb
              userData={userData}
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
            />

            <Screens
              setActiveScreen={setActiveScreen}
              activeScreen={activeScreen}
              userData={userData}
              dashData={dashData}
              kpiData={kpiData}
              docsData={docsData}
              campaignData={campaignData}
              refreshData={refreshData}
              setCategory={setCategory}
              category={category}
              transactionsBalance={transactionsBalance}
              setCommentModalVisible={setCommentModalVisible}
              KYCData={KYCData}
              FTDData={FTDData}
            />
          </div>
        </div>
      </div>
    </>
  )
}