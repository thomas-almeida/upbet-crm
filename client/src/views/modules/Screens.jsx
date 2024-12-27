import { useEffect } from "react"
import Menu from "./Menu"
import Category from "./Category"
import DashChart from "./DashChart"

export default function Screens({
  activeScreen,
  setActiveScreen,
  userData,
  dashData,
  kpiData,
  campaignData,
  refreshData,
  setCategory,
  category
}) {

  useEffect(() => {
    console.log(activeScreen)
  })

  return (
    <>
      {
        activeScreen === 'menu' &&
        <Menu
          visible={true}
          userData={userData}
          setActiveScreen={setActiveScreen}
          activeScreen={activeScreen}
          refreshData={refreshData}
          setCategory={setCategory}
          category={category}
        />
      }
      {
        activeScreen === 'category' &&
        <Category
          visible={true}
          userData={userData}
          dashData={dashData}
          kpiData={kpiData}
          campaignData={campaignData}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          refreshData={refreshData}
          setCategory={setCategory}
          category={category}
        />
      }
      {
        activeScreen === 'chart' &&
        <DashChart
          visible={true}
          dashData={dashData}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          refreshData={refreshData}
        />
      }
    </>
  )
}