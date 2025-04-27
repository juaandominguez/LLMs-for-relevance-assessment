import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).not.toBeNull();
  });
});

