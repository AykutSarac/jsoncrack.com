import { StorageConfig } from "src/typings/global";

export const defaultJson = {
  Author: "J. K. Rowling",
  Genre: "Fantasy",
  Characters: ["Hermione Granger", "Harry Potter", "Lord Voldemort", "MORE"],
  Books: [
    { title: "Philosopher's Stone", date: "1997" },
    {
      title: "Chamber of Secrets",
      date: "1998",
    },
    {
      title: "Prisoner of Azkaban",
      date: "1999",
    },
    {
      title: "Goblet of Fire",
      date: "1999",
    },
    {
      title: "Order of the Phoenix",
      date: "2003",
    },
    {
      title: "Half-Blood Prince",
      date: "2005",
    },
    {
      title: "Deathly Hallows",
      date: "2007",
    },
  ],
};

export const defaultConfig: StorageConfig = {
  layout: "LEFT",
  expand: true,
  autoformat: true,
  hideEditor: false,
  zoomPanPinch: null,
  lightmode: false
};
