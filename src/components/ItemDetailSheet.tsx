import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet"; // Adjust import path as needed
import { Item } from "../lib/types";
import { useTranslation } from "react-i18next";

interface ItemDetailSheetProps {
  item: Item;
  setSelectedItem: (item: Item | null) => void;
  themeColor: string;
}

const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({
  item,
  setSelectedItem,
  themeColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()
  const handleClose = () => {
    setIsOpen(false);
    setSelectedItem(null); // Clear selected item on close
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div
          onClick={() => setIsOpen(true)} // Open the sheet on click
          className="flex items-center shadow-lg shadow-slate-200 p-5 rounded-3xl hover:shadow-lg mx-3 cursor-pointer bg-white"
        >
          <div className="size-14 rounded-full   overflow-hidden border flex items-center justify-center mx-5">
            <img src={item.image} alt={item.name} className="w-full object-contain" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-700">{t(item.name)}</h2>
            <p className="text-slate-400">{item.price.toLocaleString('en-US')} {t("IQD")}</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="mx-8" side="bottom">
        <div className="relative p-4 space-y-4">
          <div className="size-50 flex items-center justify-center object-contain">
            <img
              src={item.image}
              alt={t(item.name)}
              className="w-full object-cover rounded-lg"
            />
          </div>
          <div className="text-center">
            <SheetTitle className="text-3xl font-semibold">
              {t(item.name)}
            </SheetTitle>
            <p className="text-xl text-white mt-2">
              <span
                style={{
                  color: themeColor,
                }}
              >
                {item.price.toLocaleString('en-US')} {t("IQD")}
              </span>
            </p>
            <SheetDescription className="text-sm text-gray-500 mt-4 ">
              {t(item?.description || "No details available.")}
            </SheetDescription>
          </div>
          {/* Close Button */}
          <div className="flex justify-center mt-6">
            <button
              style={{
                backgroundColor: themeColor,
              }}
              onClick={handleClose}
              className="text-white py-3 px-14 rounded-full text-lg font-semibold transition"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ItemDetailSheet;
