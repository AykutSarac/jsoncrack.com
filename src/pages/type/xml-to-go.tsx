import React from "react";
import { FileFormat, TypeLanguage } from "src/enums/file.enum";
import { TypegenWrapper } from "src/layout/TypeLayout/TypegenWrapper";

const TypePage = () => {
  return <TypegenWrapper from={FileFormat.XML} to={TypeLanguage.Go} />;
};

export default TypePage;
