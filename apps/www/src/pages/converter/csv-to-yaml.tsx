import React from "react";
import { FileFormat } from "../../enums/file.enum";
import { ToolPage } from "../../layout/ConverterLayout/ToolPage";

const Page = () => {
  return <ToolPage from={FileFormat.CSV} to={FileFormat.YAML} />;
};

export default Page;
