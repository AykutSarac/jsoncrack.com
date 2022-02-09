import React from "react";
import styled from "styled-components";
import JSONInput from "react-json-editor-ajrm";
import { useLocalStorage } from "usehooks-ts";
import locale from "react-json-editor-ajrm/locale/en";

interface JsonData {
  plainText: string;
  markupText: string;
  json: string;
  jsObject?: object;
  lines: number;
  error: boolean;
}

const StyledJSONInput = styled(JSONInput)`
  margin-top: 10px;
  padding: 5px;
`;

export const defaultValue = [
  {
    Author: "J. K. Rowling.",
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
  },
];

export const JsonEditor: React.FC<{
  json: string;
  setJson: React.Dispatch<React.SetStateAction<string>>;
}> = ({ json, setJson }) => {
  const [initialJson, setInitialJson] = React.useState(json);

  React.useEffect(() => {
    const jsonStored = localStorage.getItem("json");
    if (jsonStored) setInitialJson(jsonStored);
  }, []);

  React.useEffect(() => {
    if (json === "[]") setInitialJson(json);
  }, [json]);

  React.useEffect(() => {
    const element = document.querySelector(
      '[name="outer-box"] > div'
    ) as HTMLDivElement;
    if (element) {
      element.style.transform = "translate(-75%, 25%)";
    }
  }, []);

  const handleChange = (data: JsonData) => {
    if (!data.error) {
      if (data.json === "") return setJson("[]");
      setJson(data.json);
    }
  };

  return (
    <StyledJSONInput
      placeholder={JSON.parse(initialJson)}
      onChange={handleChange}
      locale={locale}
      height="100%"
      width="auto"
    />
  );
};
