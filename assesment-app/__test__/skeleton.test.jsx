import { expect, describe, it } from "bun:test";
import { render } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("should render skeleton with default classes", () => {
    const { container } = render(<Skeleton />);
    
    const skeleton = container.firstChild;
    expect(skeleton).not.toBeNull();
    expect(skeleton.className).toContain("rounded-md");
    expect(skeleton.className).toContain("animate-pulse");
  });

  it("should render with custom classes", () => {
    const { container } = render(<Skeleton className="h-10 w-20 rounded-md" />);
    
    const skeleton = container.firstChild;
    expect(skeleton.className).toContain("h-10");
    expect(skeleton.className).toContain("w-20");
    expect(skeleton.className).toContain("rounded-md");
  });

  it("should render with custom dimensions", () => {
    const { container } = render(
      <Skeleton style={{ width: "200px", height: "50px" }} />
    );
    
    const skeleton = container.firstChild;
    expect(skeleton.style.width).toBe("200px");
    expect(skeleton.style.height).toBe("50px");
  });
}); 