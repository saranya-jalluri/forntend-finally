import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Heritage Explorer authentication", () => {
  render(<App />);
  expect(screen.getByText("Heritage Explorer")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});
