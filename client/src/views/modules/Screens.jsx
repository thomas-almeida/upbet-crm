import { useEffect } from "react"
import Menu from "./Menu"
import Category from "./Category"
import DashChart from "./DashChart"
import Docs from "./Docs"

export default function Screens({
  activeScreen,
  setActiveScreen,
  userData,
  dashData,
  kpiData,
  docsData,
  campaignData,
  refreshData,
  setCategory,
  category,
  transactionsBalance,
  setCommentModalVisible,
  KYCData,
  FTDData,
  setKYCData,
  setFTDData
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
          transactionsBalance={transactionsBalance}
          KYCData={KYCData}
          FTDData={FTDData}
          setFTDData={setFTDData}
          setKYCData={setKYCData}
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
          setCommentModalVisible={setCommentModalVisible}
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
          setCommentModalVisible={setCommentModalVisible}
        />
      }
      {
        activeScreen === 'docs' &&
        <Docs
          visible={true}
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          refreshData={refreshData}
          userData={userData}
          docsData={docsData}
        />
      }
    </>
  )
}