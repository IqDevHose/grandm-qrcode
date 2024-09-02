import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import i18n from "./i18next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const changeLanguage = (lng:string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
  document.documentElement.lang = lng;
  document.body.dir = lng === "ar" ? "rtl" : "ltr";
};
