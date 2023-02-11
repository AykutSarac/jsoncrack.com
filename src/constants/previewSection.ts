import { defaultJson } from "./data";

export const TABS = [
  {
    id: 0,
    name: "Standard JSON",
    json: defaultJson,
  },
  {
    id: 1,
    name: "Gallery",
    json: JSON.stringify(
      {
        "cats! 🐾": [
          "https://gifimage.net/wp-content/uploads/2017/10/cool-cat-gif-1.gif",
          "https://media.tenor.com/vRHYVqQCMQAAAAAM/cool-cat-chilling.gif",
          "https://media.tenor.com/k6B6P_kvBSYAAAAM/awesome-cat.gif",
        ],
      },
      null,
      2
    ),
  },
  {
    id: 2,
    name: "Nested JSON",
    json: JSON.stringify(
      [
        {
          id: "0001",
          type: "donut",
          name: "Cake",
          ppu: 0.55,
          batters: {
            batter: [
              { id: "1001", type: "Regular" },
              { id: "1002", type: "Chocolate" },
              { id: "1003", type: "Blueberry" },
              { id: "1004", type: "Devil's Food" },
            ],
          },
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            { id: "5007", type: "Powdered Sugar" },
            { id: "5006", type: "Chocolate with Sprinkles" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" },
          ],
        },
        {
          id: "0002",
          type: "donut",
          name: "Raised",
          ppu: 0.55,
          batters: {
            batter: [{ id: "1001", type: "Regular" }],
          },
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" },
          ],
        },
        {
          id: "0003",
          type: "donut",
          name: "Old Fashioned",
          ppu: 0.55,
          batters: {
            batter: [
              { id: "1001", type: "Regular" },
              { id: "1002", type: "Chocolate" },
            ],
          },
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5003", type: "Chocolate" },
            { id: "5004", type: "Maple" },
          ],
        },
      ],
      null,
      2
    ),
  },
];
