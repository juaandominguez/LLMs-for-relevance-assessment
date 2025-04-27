import { expect, describe, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock RadixUI's DropdownMenu
mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children }) => <div data-testid="dropdown-root">{children}</div>,
  Trigger: ({ children }) => <button data-testid="dropdown-trigger">{children}</button>,
  Portal: ({ children }) => <div data-testid="dropdown-portal">{children}</div>,
  Content: ({ children, ...props }) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, ...props }) => (
    <div data-testid="dropdown-item" {...props}>
      {children}
    </div>
  ),
  Label: ({ children, ...props }) => (
    <div data-testid="dropdown-label" {...props}>
      {children}
    </div>
  ),
  Separator: () => <div data-testid="dropdown-separator" />,
}));

describe("DropdownMenu", () => {
  it("should render complete dropdown menu", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  });

  it("should render with custom classes", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Test Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  });
}); 