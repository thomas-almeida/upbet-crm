import options from "../../utils/options";

export default function Menu({
  visible,
  userData,
  setActiveScreen,
  setCategory,
  category,
  activeScreen,
  refreshData
}) {

  function setItem(activeScreen, category) {
    setActiveScreen(activeScreen)
    setCategory(category)
    console.log(category)
  }

  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] text-center h-[85vh]">
          <div >
            <h1 className="font-semibold text-2xl text-left mt-6">
              Bem-vindo {userData?.name}
            </h1>
            <p className="text-left py-2">Veja os dashboards criados e suas categorias</p>

            <div className="flex justify-start items-center py-10">
              {
                options.map((option, index) => (
                  option.activeScreen !== 'docs' ? (
                    <div
                      key={option[index]}
                      className="bg-white border-2 p-4 m-2 text-left w-[300px] h-[180px] rounded-md shadow-sm relative cursor-pointer transition hover:scale-[1.02] hover:text-[#008181] hover:border-[#008181]"
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

                  ) : ''
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}