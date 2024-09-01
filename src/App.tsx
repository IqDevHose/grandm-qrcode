import { Search } from "lucide-react"
import { Input } from "./components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Badge } from "./components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
const resId = 'clztug1a60000hb92oth3lmxp'
function App() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState([]);
  const query = useQuery({
    queryKey: ['restaurant', resId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/restaurant/${resId}`)
      return await res.data
    }
  })

  console.log(query?.data)
  return (
    <>
      <div className="md:px-72 px-2 py-10   w-full h-screen overflow-hidden ">
        {/* search bar */}
        <div className="border md:p-10">
          <div className="flex gap-3 items-center relative ">
            <Input placeholder="Search here..." />
            <Search className="absolute right-3" />
          </div>
          {/* categories */}
          <div className="flex space-x-4 p-4 overflow-x-scroll  border mt-10">
            <button
              onClick={() => setActiveTab('All')}
              className={`${activeTab === 'All'
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-900"
                } whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200`}
            >
              All
            </button>
            {query?.data?.categories?.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setItems(tab.items)
                }}
                className={`${activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-900"
                  } whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          {/* menu */}
          <div className="space-y-4 mt-10">
            {
              items?.map((item: any) => {
                return (
                  <div key={item.id} className="flex p-5 border rounded-lg  hover:shadow-lg mx-2">
                    <div className="size-14 rounded object-contain overflow-hidden border flex items-center justify-center mr-5">
                      <img src={item.image} alt={item.name} className=" w-full" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{item.name}</h2>
                      <p className="text-gray-400">{item.price} IQD</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
