import { useApi } from "@/lib/api";
import axios from "axios";

jest.mock("axios");

describe("useApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("get method sends a GET request with authorization header", async () => {
    const token = "dummyToken";
    const url = "https://api.example.com/data";

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValueOnce(token),
      },
      writable: true,
    });

    axios.get.mockResolvedValueOnce({ data: "dummyData" });

    const api = useApi();
    const result = await api.get(url);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual("dummyData");
  });

  test("post method sends a POST request with authorization header", async () => {
    const token = "dummyToken";
    const url = "https://api.example.com/data";
    const body = { data: "dummyBody" };

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValueOnce(token),
      },
      writable: true,
    });

    axios.post.mockResolvedValueOnce({ data: "dummyData" });

    const api = useApi();
    const result = await api.post(url, body);

    expect(axios.post).toHaveBeenCalledWith(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(result).toEqual("dummyData");
  });
});
