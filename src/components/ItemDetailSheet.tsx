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
          className="flex p-5 border rounded-lg hover:shadow-lg mx-2 cursor-pointer"
        >
          <div className="size-14 rounded object-contain overflow-hidden border flex items-center justify-center mr-5">
            <img src={item.image} alt={item.name} className="w-full" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p className="text-gray-400">{item.price} IQD</p>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="p-6 space-y-4">
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
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
