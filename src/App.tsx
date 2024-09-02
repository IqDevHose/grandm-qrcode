import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ItemDetailSheet from "./components/ItemDetailSheet"; // Import the new component
import { Item, Category } from "./lib/types";

const resId = "clztug1a60000hb92oth3lmxp";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // state to track the selected item
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: Item[] }>(
    {}
  ); // State to track grouped items

  const query = useQuery({
    queryKey: ["restaurant", resId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/restaurant/${resId}`);
      return res.data;
    },
  });

  const themeColor = query?.data?.theme?.primary;

  useEffect(() => {
    // Initialize items based on activeTab and group items by category
    if (activeTab === "All") {
      const allItems =
        query?.data?.categories?.flatMap(
          (category: Category) => category.items
        ) || [];
      setItems(allItems);
      setFilteredItems(allItems); // Initialize filteredItems with all items

      // Group items by category
      const grouped = query?.data?.categories?.reduce(
        (acc: { [key: string]: Item[] }, category: Category) => {
          acc[category.name] = category.items;
          return acc;
        },
        {}
      );
      setGroupedItems(grouped || {});
    } else {
      const selectedCategory = query?.data?.categories?.find(
        (category: Category) => category.id === activeTab
      );
      const categoryItems = selectedCategory ? selectedCategory.items : [];
      setItems(categoryItems);
      setFilteredItems(categoryItems); // Initialize filteredItems with selected category items
    }
  }, [query?.data, activeTab]);

  useEffect(() => {
    // Filter items based on the search query
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(trimmedQuery)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Reset to all items if search query is empty
    }
  }, [searchQuery, items]);

  return (
    <>
      <div className="md:px-72 px-2 py-10 w-full h-screen overflow-hidden bg-slate-100">
        {/* search bar and category tabs */}
        <div className="sticky top-0 z-10 ">
          <div className="flex gap-3 items-center relative rounded-full md:rounded">
            <Input
              placeholder="Search here..."
              className="rounded-full border-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
            />
            <Search className="absolute right-5" />
          </div>
          {/* categories */}
          <div className="flex mx-2 rounded-lg space-x-4 p-4 overflow-x-scroll mt-10 bg-white">
            <button
              onClick={() => setActiveTab("All")}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 ${
                activeTab === "All" ? "text-white" : "bg-gray-200 text-gray-900"
              }`}
              style={{
                backgroundColor:
                  activeTab === "All" ? query?.data?.theme?.primary : "",
              }}
            >
              All
            </button>

            {query?.data?.categories?.map((tab: Category) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-900 "
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? query?.data?.theme?.primary : "",
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {/* menu */}
        <div className="overflow-y-auto h-[calc(100vh-250px)] px-4 pb-20 ">
          {searchQuery.trim() ? (
            filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ItemDetailSheet
                  themeColor={themeColor}
                  key={item.id}
                  item={item}
                  setSelectedItem={setSelectedItem}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No items found.</p>
            )
          ) : activeTab === "All" ? (
            <div className=" overflow-y-scroll h-full ">
              {Object.keys(groupedItems).map((categoryName) => (
                <div key={categoryName} className="mt-7">
                  <h2 className="text-xl font-bold text-gray-800 px-4 mb-2">
                    {categoryName}
                  </h2>
                  <div className="space-y-4">
                    {groupedItems[categoryName].map((item) => (
                      <ItemDetailSheet
                        themeColor={themeColor}
                        key={item.id}
                        item={item}
                        setSelectedItem={setSelectedItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 overflow-y-scroll h-full space-y-4 pb-20">
              {filteredItems.map((item) => (
                <ItemDetailSheet
                  key={item.id}
                  item={item}
                  themeColor={themeColor}
                  setSelectedItem={setSelectedItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default App;
