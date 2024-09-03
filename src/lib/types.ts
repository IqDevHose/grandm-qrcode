// types.ts

export interface Item {
    id: string;
    name: string;
    image: string;
    price: number;
    description?: string;
    category: string;
    nameAr: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    items: Item[];
  }
  
