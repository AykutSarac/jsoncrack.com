import React from "react";
import { Button } from "src/components/Button";
import { screen, render } from "@testing-library/react";

describe("Button", () => {
  it("should render Button component", () => {
    render(<Button>Click Me!</Button>);
    expect(
      screen.getByRole("button", { name: /Click Me/ })
    ).toBeInTheDocument();
  });
});
