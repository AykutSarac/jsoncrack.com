import React from "react";
import { TypegenWrapper } from "src/containers/TypeLayout/TypegenWrapper";
import { FileFormat, TypeLanguage } from "src/enums/file.enum";

const TypePage = () => {
  return <TypegenWrapper from={FileFormat.JSON} to={TypeLanguage.Rust} />;
};

export default TypePage;
