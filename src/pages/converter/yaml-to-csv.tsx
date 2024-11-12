import React from "react";
import { ToolPage } from "src/containers/ConverterLayout/ToolPage";
import { FileFormat } from "src/enums/file.enum";

const Page = () => {
  return <ToolPage from={FileFormat.YAML} to={FileFormat.CSV} />;
};

export default Page;
