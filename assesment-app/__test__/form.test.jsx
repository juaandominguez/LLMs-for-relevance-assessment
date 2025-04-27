import { expect, describe, it, mock, spyOn } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Create a test component that uses the Form
const TestForm = () => {
  // Define form schema
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // Define onSubmit handler
  const onSubmit = (data) => {
    document.getElementById("submitted-data").textContent = JSON.stringify(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
      <div id="submitted-data"></div>
    </div>
  );
};

// Mock react-hook-form
const mockHandleSubmit = (handler) => (e) => {
  e.preventDefault();
  handler({ username: "test-user" });
};

mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    control: {},
  }),
}));

describe("Form", () => {
  it("should render form with all components", () => {
    render(<TestForm />);
    
    expect(screen.getByText("Username")).not.toBeNull();
    expect(screen.getByPlaceholderText("Enter username")).not.toBeNull();
    expect(screen.getByText("This is your public display name.")).not.toBeNull();
    expect(screen.getByText("Submit")).not.toBeNull();
  });
}); 