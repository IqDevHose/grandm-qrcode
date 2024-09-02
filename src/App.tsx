import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ItemDetailSheet from "./components/ItemDetailSheet"; // Import the new component
import { Item, Category } from "./lib/types";

const resId = 'clztug1a60000hb92oth3lmxp';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null); // state to track the selected item
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: Item[] }>({}); // State to track grouped items

  const query = useQuery({
    queryKey: ['restaurant', resId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/restaurant/${resId}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (activeTab === "All") {
      const allItems =
        query?.data?.categories?.flatMap((category: Category) => category.items) || [];
      setItems(allItems);
      setFilteredItems(allItems); // Initialize filteredItems with all items

      // Group items by category
      const grouped = query?.data?.categories?.reduce((acc: { [key: string]: Item[] }, category: Category) => {
        acc[category.name] = category.items;
        return acc;
      }, {});
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
    if (searchQuery.trim()) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Reset to all items if search query is empty
    }
  }, [searchQuery, items]);

  return (
    <>
      <div className="md:px-72 px-2 py-10 w-full h-screen overflow-hidden bg-gray-100">
        {/* search bar and category tabs */}
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex gap-3 items-center relative mx-4 rounded-full">
            <Input
              placeholder="Search here..."
              className="rounded-full md:rounded border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
            />
            <Search className="absolute right-3" />
          </div>
          {/* categories */}
          <div className="flex space-x-4 p-4 overflow-x-scroll border-t border-b mt-10">
            <button
              onClick={() => setActiveTab("All")}
              className={`${activeTab === "All"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-900"
                } whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200`}
            >
              All
            </button>
            {query?.data?.categories?.map((tab: Category) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-900"
                  } whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {/* menu */}
        <div className="space-y-4 mt-4 overflow-y-auto h-full px-4 pb-32">
          {searchQuery.trim() ? (
            filteredItems.map((item) => (
              <ItemDetailSheet
                key={item.id}
                item={item}
                setSelectedItem={setSelectedItem}
              />
            ))
          ) : activeTab === "All" ? (
            Object.keys(groupedItems).map((categoryName) => (
              <div key={categoryName} className="pb-4">
                <h2 className="text-2xl font-bold text-gray-800 py-4">{categoryName}</h2>
                <div className="space-y-4">
                  {groupedItems[categoryName].map((item) => (
                    <ItemDetailSheet
                      key={item.id}
                      item={item}
                      setSelectedItem={setSelectedItem}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            filteredItems.map((item) => (
              <ItemDetailSheet
                key={item.id}
                item={item}
                setSelectedItem={setSelectedItem}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default App;
