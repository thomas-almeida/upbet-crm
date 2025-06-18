import customerBaseOptions from "../../utils/customerBaseOptions";
import mockedCustomers from "../../utils/mockedCustomers";
import CountUp from "react-countup";

export default function CustomerBase({
  visible,
  activeScreen,
  setActiveScreen,
  userData,
  refreshData,
}) {
  return (
    <>
      <div className={visible ? 'flex items-center justify-center' : 'hidden'}>
        <div className="w-[75vw] h-[85vh]">
          <div>
            <h1 className="font-semibold text-2xl text-left mt-6 capitalize">
              Base de Clientes
            </h1>
            <p className="text-left py-2">
              Veja e gerencie os dados dos seus clientes
            </p>
          </div>
          <div className="grid justify-start grid-cols-4">
            {
              customerBaseOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-white border-2 p-4 mx-2 my-2 ml-0 text-left h-[120px] rounded-md shadow-sm relative cursor-pointer transition hover:scale-[1.02] hover:text-[#008181] hover:border-[#008181]"
                >
                  <div className="absolute bottom-2">
                    <div className="flex items-center">
                      <img src={option.icon} alt={option.name} className="w-6 h-6 mr-2" />
                      <span className="font-medium text-lg">{option.name}</span>
                    </div>
                    <h1 className="text-4xl font-semibold my-2">
                      <CountUp
                        end={option.value}
                        duration={1}
                        decimals={option.type === 'money' ? 2 : 0}
                        prefix={option.type === 'money' ? 'R$ ' : ''}
                        decimal=","
                        separator="."
                      />
                    </h1>
                  </div>
                </div>
              ))
            }
          </div>
          <hr className="mb-2 rounded-full" />
          <div className="overflow-x-scroll w-full">
            <table className="min-w-full cursor-pointer">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">CPF</th>
                  <th className="px-4 py-2">Telefone</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Renda Ind.</th>
                  <th className="px-4 py-2">Estágio</th>
                  <th className="px-4 py-2">Empreendimento</th>
                  <th className="px-4 py-2">Jornada Ativa</th>
                </tr>
              </thead>
              <tbody>
                {
                  mockedCustomers.map((customer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.cpf}</td>
                      <td className="px-4 py-2">{customer.phone}</td>
                      <td className="px-4 py-2">{customer.score}</td>
                      <td className="px-4 py-2">
                        R$ {customer.value.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-block rounded bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                          {customer.stage[Math.floor(Math.random() * customer.stage.length)]}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-block rounded bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                          {customer.building[Math.floor(Math.random() * customer.building.length)]}
                        </span>
                      </td>
                      <td>
                        <span className="inline-block rounded bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700">
                          {(customer.journey || customer.jorney)[Math.floor(Math.random() * ((customer.journey || customer.jorney)?.length || 1))]}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}