import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";
import axios from "axios";
import { UserSelect } from "./User";

jest.mock("axios");

describe("UserSelect", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: JSON.stringify([
        { id: "1", email: "user1@example.com" },
        { id: "2", email: "user2@example.com" },
      ]),
    });
    render(<UserSelect onUserSelected={jest.fn()} />);
  });

  test("renders select element with options", async () => {
    // Wait for the users to be fetched
    await screen.findByText("Select user");
    await screen.findByText("user1@example.com");
    await screen.findByText("user2@example.com");

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    const optionElements = screen.getAllByRole("option");
    expect(optionElements).toHaveLength(3); // Including the default "Select user" option
    expect(optionElements[0]).toHaveTextContent("Select user");
    expect(optionElements[1]).toHaveTextContent("user1@example.com");
    expect(optionElements[2]).toHaveTextContent("user2@example.com");
  });
});
