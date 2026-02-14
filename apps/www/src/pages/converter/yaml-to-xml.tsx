import React from "react";
import { FileFormat } from "../../enums/file.enum";
import { ToolPage } from "../../layout/ConverterLayout/ToolPage";

const Page = () => {
  return <ToolPage from={FileFormat.YAML} to={FileFormat.XML} />;
};

export default Page;
