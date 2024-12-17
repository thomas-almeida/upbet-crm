export default function BarChart({ data, label, value }) {

  const yx = {
    x: label,
    y: value
  }

  return (
    <>
      <div className="border p-4">
        <div className="flex p-4">
          <div className="mr-2">
            <p>y</p>
            {
              data?.results?.map((valueItem) => (
                <p className="">{valueItem[value]}</p>
              ))
            }
          </div>
          <div className="border w-full">

          </div>
        </div>
        <div className="flex">
          <p>x</p>
          {
            data?.results?.map((labelItem) => (
              <p className="mx-2 border-2 px-4 rounded-md ">{labelItem[label]}</p>
            ))
          }
        </div>
      </div>
    </>
  );
}
