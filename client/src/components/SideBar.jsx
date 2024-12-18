
import options from "../utils/options.js"
export default function Sidebar({
  setActiveScreen,
  setCategory,
  userData
}) {

  function setItem(activeScreen, category) {
    setActiveScreen(activeScreen)
    setCategory(category)
  }

  return (
    <>
      <div className="h-[95vh] w-[240px] p-4 rounded-md">

        <div className="flex justify-start items-center border-2 p-2 rounded-md shadow-sm bg-white">
          <img
            src={userData?.profile} 
            className="w-[40px] rounded-md border border-slate-300 shadow-sm" 
          />

          <div className="mx-2">
            <h3 className="font-semibold">{userData?.name} - {userData?.role}</h3>
            <p className="text-[#008181] font-semibold">@{userData?.username}</p>
          </div>
        </div>
        <div className="border-2 mt-2 p-4 rounded-md shadow-sm bg-white">
          <ul className="my-2">
            <li
              className="py-2 cursor-pointer hover:text-[#008181] hover:font-semibold text-lg flex justify-start items-center transition hover:scale-[1.02]"
              onClick={() => setActiveScreen('menu')}
            >
              <img src="/home.svg" className="w-[15px] mr-1" alt="" />
              <p>Home</p>
            </li>
          </ul>
          <ul className="">
            <li className="font-semibold text-lg">Visões</li>
            {
              options.map((option, index) => (
                <li
                  key={option[index]}
                  className="py-2 cursor-pointer transition hover:text-[#008181] hover:font-semibold hover:scale-[1.02] text-lg flex justify-start items-center"
                  onClick={() => setItem(option.activeScreen, option.category)}
                >
                  <img src={option.icon} className="w-[15px] mr-1" alt="" />
                  <p>{option.name}</p>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </>
  )
}