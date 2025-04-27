import { expect, describe, it, mock, spyOn } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppSidebar } from "@/components/sidebar";

// Mock next/navigation
mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: spyOn({}, "push") }),
}));

describe("Sidebar", () => {
  it("should render sidebar with navigation links", () => {
    render(<AppSidebar />);
    
    // Check for common sidebar navigation links
    expect(screen.getByText("Open")).not.toBeNull();
  });

  it("should render mobile sidebar toggle", () => {
    render(<AppSidebar />);
    
    // Should have a mobile menu button
    const mobileMenuButton = screen.getByRole("button", { name: /menu/i });
    expect(mobileMenuButton).not.toBeNull();
  });
}); 