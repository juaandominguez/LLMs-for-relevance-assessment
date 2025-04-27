import { expect, describe, it, spyOn } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("should render input element", () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).not.toBeNull();
    expect(input.tagName).toBe("INPUT");
  });

  it("should handle different input types", () => {
    render(<Input type="password" placeholder="Enter password" />);
    
    const input = screen.getByPlaceholderText("Enter password");
    expect(input.type).toBe("password");
  });

  it("should handle disabled state", () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input.disabled).toBe(true);
  });
}); 