import React, { useState, useEffect } from "react";
import { Globe, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Category, Item } from "@/lib/types";
import { changeLanguage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ItemDetailSheet from "@/components/ItemDetailSheet";
import { useParams } from "react-router-dom";



const Restaurant: React.FC = () => {
    const {id} = useParams()
  const [activeTab, setActiveTab] = useState<string>("All");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [_, setSelectedItem] = useState<Item | null>(null); // state to track the selected item
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]| [] >([]);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: Item[] }>(
    {}
  ); // State to track grouped items

  const query = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await axios.get(`https://grand-mellienum-surveys-backend.onrender.com/restaurant/${id}`);
      return res.data;
    },
    enabled : !!id
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
      let filtered = [] as Item[];
  
      if (i18n.language === 'ar') {
        // Only check Arabic names
        filtered = items.filter((item) => {
          const nameArExists = item.nameAr && item.nameAr.includes(trimmedQuery);
          return nameArExists;
        });
      } else if (i18n.language === 'en') {
        // Only check English names
        filtered = items.filter((item) => {
          const nameExists = item.name && item.name.toLowerCase().includes(trimmedQuery);
          return nameExists;
        });
      }
  
      console.log("Filtered Items:", filtered); // Log the filtered items
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Reset to all items if search query is empty
    }
  }, [searchQuery, items, i18n.language]);
  
  
  
  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };
  return (
    <>
      <div className=" px-2 py-10 w-full h-screen relative overflow-hidden bg-slate-100">
        {/* search bar and category tabs */}
        <div className="w-24 flex z-50 items-center justify-center overflow-hidden text-center absolute bottom-28 right-5 bg-white p-3 shadow shadow-slate-300  rounded-full ">
          <img
            src={query?.data?.image}
            alt={query?.data?.name}
            className="w-full object-contain"
          />
        </div>
        <Button
          onClick={handleLanguageChange}
          variant={"default"}
          className="absolute rounded-full w-24   flex items-center gap-1 bottom-14 right-5 shadow-lg shadow-slate-400"
        >
          {language === "ar" && <Globe size={16} className="size-4" />}
          {language === "en" ? "العربية" : "Eng"}
          {language === "en" && <Globe size={16} className="size-4" />}
        </Button>
        <div className="sticky top-0 z-10 ">
          <div className="flex items-center relative rounded-full md:rounded  ">
            <Input
              placeholder={t("Search here...")}
              className="rounded-full border-none w-full m-3 shadow-lg shadow-slate-300 p-7"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
            />
            <Search
              className={`absolute ${
                language === "en" ? "right-8" : "left-8"
              } text-slate-400`}
            />
          </div>
          {/* categories */}
          <div className="flex shadow-lg shadow-slate-200 mx-3 rounded-lg p-4 overflow-x-scroll mt-5 bg-white">
            <button
              onClick={() => setActiveTab("All")}
              className={`whitespace-nowrap mx-2 px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 ${
                activeTab === "All"
                  ? "text-white"
                  : "bg-slate-100 text-gray-900"
              }`}
              style={{
                backgroundColor:
                  activeTab === "All" ? query?.data?.theme?.primary : "",
              }}
            >
              {t("All")}
            </button>

            {query?.data?.categories?.map((tab: Category) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap mx-2 px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 ${
                  activeTab === tab.id
                    ? " text-white"
                    : "bg-slate-100 text-gray-900 "
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? query?.data?.theme?.primary : "",
                }}
              >
                {t(tab.name)}
              </button>
            ))}
          </div>
        </div>
        {/* menu */}
        {/* <div className="w-full flex justify-center bg-white shadow-lg shadow-slate-200">
          <div className="size-24 flex items-center justify-center overflow-hidden text-center ">
            <img src={query?.data?.image} alt={query?.data?.name} className="w-full object-contain" />
          </div>
        </div> */}
        <div className=" h-[calc(100vh-250px)] space-y-4 mt-4 ">
          {searchQuery?.trim() ? (
            filteredItems?.length > 0 ? (
              filteredItems?.map((item) => (
                <ItemDetailSheet
                  themeColor={themeColor}
                  key={item.id}
                  item={item}
                  setSelectedItem={setSelectedItem}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                {t("No items found.")}
              </p>
            )
          ) : activeTab === "All" ? (
            <div className=" overflow-y-scroll h-full ">
              {Object.keys(groupedItems).map((categoryName) => (
                <div key={categoryName} className="mt-7">
                  <h2 className="text-xl font-bold text-gray-800 px-4 mb-2">
                    {t(categoryName)}
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
            <div className="mt-10 overflow-y-scroll h-full space-y-4 pb-10">
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
export default Restaurant;
