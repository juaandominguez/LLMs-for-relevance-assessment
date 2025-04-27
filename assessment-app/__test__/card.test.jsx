import { expect, describe, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

describe("Card", () => {
  it("should render card with all subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText("Card Title")).not.toBeNull();
    expect(screen.getByText("Card Description")).not.toBeNull();
    expect(screen.getByText("Card Content")).not.toBeNull();
    expect(screen.getByText("Card Footer")).not.toBeNull();
  });

  it("should render card with only content", () => {
    render(
      <Card>
        <CardContent>
          <p>Simple Card Content</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText("Simple Card Content")).not.toBeNull();
  });
}); 