import React from "react";
import { FileFormat } from "src/enums/file.enum";
import { ToolPage } from "src/layout/ConverterLayout/ToolPage";

const Page = () => {
  return <ToolPage from={FileFormat.YAML} to={FileFormat.JSON} />;
};

export default Page;
