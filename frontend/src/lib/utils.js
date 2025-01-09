import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      if(typeof fileReader.result === 'string') {
        resolve(fileReader.result);
      }
    }
    fileReader.readAsDataURL(file);
  })
}
