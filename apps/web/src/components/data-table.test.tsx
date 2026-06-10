import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

describe("DataTable", () => {
  it("renders an empty state", () => {
    render(<DataTable columns={["name"]} rows={[]} />);
    expect(screen.getByText("No records found.")).toBeInTheDocument();
  });

  it("renders row values", () => {
    render(<DataTable columns={["name"]} rows={[{ _id: "1", name: "Asha Rao" }]} />);
    expect(screen.getByText("Asha Rao")).toBeInTheDocument();
  });
});
