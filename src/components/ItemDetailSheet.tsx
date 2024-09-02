import React from "react";
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

const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({ item, setSelectedItem }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          onClick={() => setSelectedItem(item)} // Set the selected item on click
          className="flex p-5  rounded-lg hover:shadow-lg mx-2 cursor-pointer bg-white "
        >
          {/* Circular Image */}
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          {/* Item Details */}
          <div>
            <h2 className="font-bold text-sm">{item.name}</h2>
            <p className="text-gray-400">{item.price} IQD</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="p-6 space-y-4">
          <div className="size-50 flex items-center justify-center object-contain ">
            <img src={item.image} alt={item.name} className="w-full  object-cover rounded-lg" />
          </div>
          <div className="text-center">
            <SheetTitle className="text-2xl font-bold">{item.name}</SheetTitle>
            <p className="text-xl text-green-600 mt-2">{item.price} IQD</p>
            <SheetDescription className="text-sm text-gray-500 mt-4">{item.description || 'No details available.'}</SheetDescription>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ItemDetailSheet;
