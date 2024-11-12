import React from "react";
import { ToolPage } from "src/containers/ConverterLayout/ToolPage";
import { FileFormat } from "src/enums/file.enum";

const Page = () => {
  return <ToolPage from={FileFormat.CSV} to={FileFormat.JSON} />;
};

export default Page;
