import { expect, describe, it } from "bun:test";
import { render } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("should render horizontal separator by default", () => {
    const { container } = render(<Separator />);

    const separator = container.firstChild;
    expect(separator).not.toBeNull();
    expect(separator.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator.className).toContain("h-[1px]"); // Horizontal styling
  });

  it("should render vertical separator when specified", () => {
    const { container } = render(<Separator orientation="vertical" />);

    const separator = container.firstChild;
    expect(separator).not.toBeNull();
    expect(separator.getAttribute("data-orientation")).toBe("vertical");
    expect(separator.className).toContain("w-[1px]"); // Vertical styling
  });

  it("should apply custom classes", () => {
    const { container } = render(<Separator className="bg-red-500" />);

    const separator = container.firstChild;
    expect(separator.className).toContain("bg-red-500");
  });
});
