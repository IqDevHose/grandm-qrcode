import React, { useState, useEffect } from "react";
import { Globe, Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Item, Category } from "./lib/types";
import { useTranslation } from "react-i18next";
import { Button } from "./components/ui/button";
import { changeLanguage } from "./lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import axiosInstance from "./lib/axiosInstance";

const resId = "clztug1a60000hb92oth3lmxp";

// Fetch functions
const fetchCategories = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/category?page=${pageParam}&restaurantId=${resId}`
  );
  return response.data;
};

const fetchItems = async (categoryId: string) => {
  const response = await axiosInstance.get(`/category/${categoryId}`);
  return response.data.items;
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const { t, i18n } = useTranslation();
  const categoryRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Fetch restaurant data
  const { data: restaurantData } = useQuery({
    queryKey: ["restaurant", resId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurant/${resId}`
      );
      return res.data;
    },
  });

  // Fetch categories
  const {
    data: categoriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Fetch items for selected category
  const { data: items = [], isPending: isItemsLoading } = useQuery({
    queryKey: ["items", selectedCategory],
    queryFn: () => fetchItems(selectedCategory!),
    enabled: !!selectedCategory,
  });

  const categories = categoriesData?.pages.flatMap((page) => page.items) ?? [];
  const themeColor = restaurantData?.theme?.primary;

  // Filter items based on search term
  const filteredItems = items.filter((item: Item) =>
    t(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const button = categoryRefs.current[categoryId];
    if (button && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const scrollLeft = button.offsetLeft - scrollContainer.offsetWidth / 2 + button.offsetWidth / 2;
      scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    let isNearEnd = null;

    if (i18n.language === "ar") {
      // For Arabic, check if we're near the right edge since scrollLeft will be negative
      isNearEnd =
        Math.abs(container.scrollLeft) + container.clientWidth >=
        container.scrollWidth - 20;
    } else {
      // For LTR languages, check if we're near the right edge
      isNearEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 20;
    }

    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const checkForScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // If there's no horizontal scroll and we have more pages to load
      if (
        container.scrollWidth <= container.clientWidth &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    // Check initially and after any window resize
    checkForScroll();
    window.addEventListener("resize", checkForScroll);

    // Cleanup
    return () => window.removeEventListener("resize", checkForScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, categoriesData]);

  return (
    <div className="px-2 py-10 w-full min-h-screen relative bg-slate-100">
      <div className="w-full flex items-center justify-center">
        <img src={restaurantData?.image} alt={restaurantData?.name} className="w-28 md:w-52 object-contain" />
      </div>
      <Button
        onClick={handleLanguageChange}
        variant="default"
        className="fixed rounded-full w-24 flex items-center gap-1 bottom-14 right-5 shadow-lg shadow-slate-400 z-20"
      >
        {language === 'ar' && <Globe size={16} className="size-4"/>}
        {language === 'en' ? 'العربية' : 'Eng'}
        {language === 'en' && <Globe size={16} className="size-4"/>}
      </Button>


      <div className="sticky top-0 z-10 bg-slate-100 pb-4">
        {/* Search Input */}
        <div className="flex items-center relative">
          <Input
            placeholder={t("Search items...")}
            className="rounded-full border-none w-full m-3 shadow-lg shadow-slate-300 p-7"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className={`absolute ${language === 'en' ? 'right-8' : 'left-8'} text-slate-400`} />
        </div>

        {/* Categories */}
        <div
          ref={scrollContainerRef}
          className="flex shadow-lg shadow-slate-200 mx-3 rounded-lg p-4 overflow-x-auto mt-5 bg-white"
          onScroll={handleScroll}
        >
          {categories.map((category: Category) => (
            <button
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              onClick={() => handleCategoryClick(category.id)}
              className={`whitespace-nowrap mx-2 px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 ${
                category.id === selectedCategory ? "text-white" : "bg-slate-100 text-gray-900"
              }`}
              style={{
                backgroundColor: category.id === selectedCategory ? themeColor : "",
              }}
            >
              {t(category.name)}
            </button>
          ))}
          {isFetchingNextPage && (
            <div className="flex items-center px-4">
              <Skeleton className="h-8 w-20" />
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isItemsLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="shadow-md animate-pulse">
              <CardHeader>
                <Skeleton className="w-full h-60 rounded-t-lg" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-5 w-1/4" />
              </CardFooter>
            </Card>
          ))
        ) : filteredItems.length > 0 ? (
          // Render filtered items
          filteredItems.map((item: Item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <CardHeader>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={t(item.name)}
                        className="w-full object-contain h-60 rounded-t-lg"
                      />
                    )}
                    <CardTitle className="text-lg font-semibold mt-2">
                      {t(item.name)}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 truncate">
                      {t(item.description || "")}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <p className="text-primary font-bold" style={{ color: themeColor }}>
                      {t("IQD")} {item.price?.toLocaleString()}
                    </p>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t(item.name)}</DialogTitle>
                  <DialogDescription>{t(item.description || "")}</DialogDescription>
                </DialogHeader>
                <div className="p-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={t(item.name)}
                      className="w-full object-cover rounded-lg mb-4"
                      style={{ maxHeight: "60vh" }}
                    />
                  )}
                  <p className="text-lg font-bold" style={{ color: themeColor }}>
                    {t("IQD")} {item.price?.toLocaleString()}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            {t("No items found matching your search.")}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
