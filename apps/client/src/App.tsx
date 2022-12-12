import { useState } from "react";

function App() {
  const [searchByPlanets, setSearchByPlanets] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [people, setPeople] = useState([] as any[]);
  const [planets, setPlanets] = useState([] as any[]);
  const [recordObj, setRecordObj] = useState(people);
  const [selectedItem, setSelectedItem] = useState(null as any);

  const toggleSearchBy = () => {
    setSearchByPlanets(!searchByPlanets);
    setRecordObj(searchByPlanets ? people : planets);
  };

  const getData = async (key: string) => {
    setIsLoading(true);
    key === "people" ? setPeople([]) : setPlanets([]);
    const response = await fetch(`http://localhost:4000/${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsLoading(false);
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
    }
    key === "people" ? setPeople(data) : setPlanets(data);
    setRecordObj(data);
  };

  return (
    <div className="h-screen flex justify-center items-center p-24">
      <div className="p-6 bg-gray-200 rounded-lg w-full">
        <div>
          <h1 className="text-4xl mb-6">Star Wars API</h1>
        </div>

        {/** Search tools */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="flex text-xl items-center">
              <p>People</p>
              <label className="inline-flex relative items-center cursor-pointer mx-2">
                <input
                  type="checkbox"
                  checked={searchByPlanets}
                  onChange={toggleSearchBy}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-900" />
              </label>
              <p>Planets</p>
            </div>
            <button
              onClick={() => {
                getData(searchByPlanets ? "planets" : "people");
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg w-32 ml-4 max-h-12"
            >
              Load {searchByPlanets ? "Planets" : "People"}
            </button>
          </div>
          {isLoading && (
            <div className="flex items-center">
              <p className="mr-4">
                Loading {searchByPlanets ? "Planets" : "People"}...
              </p>
              <img
                src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                className="h-8"
              />
            </div>
          )}
        </div>

        <div className="flex">
          {/** List view */}
          <div className="h-80 w-[60%] bg-white p-2 rounded-lg mr-6">
            <h2 className="text-2xl pl-2">
              List / {searchByPlanets ? "Planets" : "People"}
            </h2>

            <div className="mt-2">
              <div className="flex justify-between px-4 py-2 bg-gray-200 rounded-lg font-bold">
                <h2>Name</h2>
                <h2># of Films</h2>
              </div>

              <ul className="h-[216px] overflow-auto my-2">
                {recordObj.map((item, index) => {
                  return (
                    <li
                      onClick={() => {
                        setSelectedItem(recordObj[index]);
                      }}
                      key={index}
                      className={`flex justify-between px-4 py-2 mr-2 cursor-pointer rounded-lg ${
                        selectedItem.name === item.name
                          ? "bg-gray-100"
                          : "bg-white"
                      }`}
                    >
                      <p>{item.name}</p>
                      <p>{item.films.length}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/** Info */}
          <div className="w-[40%] p-2">
            <h2 className="text-2xl">Info</h2>
            <ol className="h-full flex flex-col justify-around pb-6 pl-2">
              <li className="flex justify-between">
                <h2 className="mr-6 font-bold">Name:</h2>
                <p>{selectedItem?.name}</p>
              </li>
              <li className="flex justify-between">
                <h2 className="mr-6 font-bold">Height:</h2>
                <p>{selectedItem?.height}</p>
              </li>
              <li className="flex justify-between">
                <h2 className="mr-6 font-bold">Weight:</h2>
                <p>{selectedItem?.mass}</p>
              </li>
              <li className="flex justify-between">
                <h2 className="mr-6 font-bold">Birth Year:</h2>
                <p>{selectedItem?.birth_year}</p>
              </li>
              <li className="flex justify-between">
                <h2 className="mr-6 font-bold">Eye Color:</h2>
                <p>{selectedItem?.eye_color}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
