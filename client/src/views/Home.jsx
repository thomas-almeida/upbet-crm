import { useEffect, useState } from "react"
import Sidebar from "../components/SideBar"
import Screens from "./modules/Screens"
import Breadcrumb from "../components/Breadcrumb"
import { useNavigate } from "react-router-dom"
import service from "../service"

export default function Home() {

  const redirect = useNavigate()
  const [dashData, setDashData] = useState('')
  const [kpiData, setKPIData] = useState('')
  const [userData, setUserData] = useState('')
  const [activeScreen, setActiveScreen] = useState('menu')
  const [category, setCategory] = useState('')

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

  async function refreshData() {
    await getUserData()
    await getDashData()
    await getKPIData()
  }

  useEffect(() => {
    getUserData()
    getDashData()
    getKPIData()
  }, [])

  return (
    <>
      <div className="border p-2 bg-[#eef0f2]">
        <div className="flex justify-center items-center p-2">
          <div>
            <Sidebar
              userData={userData}
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
              setCategory={setCategory}
              category={category}
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
              refreshData={refreshData}
              setCategory={setCategory}
              category={category}
            />
          </div>
        </div>
      </div>
    </>
  )
}