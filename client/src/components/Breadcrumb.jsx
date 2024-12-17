export default function Breadcrumb({
  userData,
  activeScreen,
  setActiveScreen
}) {
  return (
    <>
      <div className="flex justify-start w-[75vw]">
        <img src={userData?.profile} className="w-[25px] rounded-sm shadow-md mx-1" alt="" />
        <p className="text-left mr-2 text-slate-500 font-semibold">{userData?.name}</p>
        <div className="mr-2 px-1 flex items-center justify-center">
          <img src="/arrow-r.svg" className="w-[15px]" />
        </div>
        <p
          className="cursor-pointer hover:text-[#008181] capitalize text-left mr-2"
          onClick={() => setActiveScreen('menu')}
        >home</p>
        <div className="mr-2 px-1 flex items-center justify-center">
          <img src="/arrow-r.svg" className="w-[15px]" />
        </div>
        <p
          className="cursor-pointer hover:text-[#008181] capitalize text-left"
          onClick={() => setActiveScreen(activeScreen)}
        >{activeScreen}</p>
      </div>
    </>
  ) 
}