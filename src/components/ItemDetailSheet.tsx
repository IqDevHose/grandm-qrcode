import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet"; // Adjust import path as needed
import { Item } from "../lib/types";

interface ItemDetailSheetProps {
  item: Item;
  setSelectedItem: (item: Item | null) => void;
}

const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({
  item,
  setSelectedItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedItem(null); // Clear selected item on close
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div
          onClick={() => setIsOpen(true)} // Open the sheet on click
          className="flex p-5 rounded-lg hover:shadow-lg mx-2 cursor-pointer bg-white"
        >
          <div className="size-14 rounded object-contain overflow-hidden border flex items-center justify-center mr-5">
            <img src={item.image} alt={item.name} className="w-full" />
          </div>
          <div>
            <h2 className="font-bold text-sm">{item.name}</h2>
            <p className="text-gray-400">{item.price} IQD</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="mx-8" side="bottom">
        <div className="relative p-4 space-y-4">
          <div className="size-50 flex items-center justify-center object-contain">
            <img
              src={item.image}
              alt={item.name}
              className="w-full object-cover rounded-lg"
            />
          </div>
          <div className="text-center">
            <SheetTitle className="text-3xl font-semibold">
              {item.name}
            </SheetTitle>
            <p className="text-xl text-green-600 mt-2">{item.price} IQD</p>
            <SheetDescription className="text-sm text-gray-500 mt-4 ">
              {item.description || "No details available."}
            </SheetDescription>
          </div>
          {/* Close Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClose}
              className="bg-green-600 text-white py-3 px-14 rounded-full text-lg font-semibold hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ItemDetailSheet;
