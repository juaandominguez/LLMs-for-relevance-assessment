import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("should render with image", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/image.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
  });

  it("should render fallback when image fails", () => {
    // Mock the onError event for the image
    const originalImage = window.Image;
    window.Image = class {
      constructor() {
        setTimeout(() => {
          this.onerror && this.onerror();
        });
      }
    };

    render(
      <Avatar>
        <AvatarImage src="invalid-url.jpg" alt="Invalid avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    
    expect(screen.getAllByText("JD")).not.toBeNull();
    
    // Restore original Image
    window.Image = originalImage;
  });
}); 