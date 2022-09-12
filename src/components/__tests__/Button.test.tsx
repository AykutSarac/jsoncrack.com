import React from "react";
import { screen, render } from "@testing-library/react";
import { Button } from "src/components/Button";

describe("Button", () => {
  it("should render Button component", () => {
    render(<Button>Click Me!</Button>);
    expect(screen.getByRole("button", { name: /Click Me/ })).toBeInTheDocument();
  });
});
