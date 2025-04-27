import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("should render with text content", () => {
    render(<Label>Email</Label>);
    
    expect(screen.getByText("Email")).not.toBeNull();
  });

  it("should render with htmlFor attribute", () => {
    render(<Label htmlFor="email">Email Address</Label>);
    
    const label = screen.getByText("Email Address");
    expect(label).not.toBeNull();
    expect(label.getAttribute("for")).toBe("email");
  });

  it("should apply custom classes", () => {
    render(<Label className="text-red-500">Required Field</Label>);
    
    const label = screen.getByText("Required Field");
    expect(label.className).toContain("text-red-500");
  });
}); 