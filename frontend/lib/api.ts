import axios from "axios";

export const useApi = () => {
  const userToken =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : "";

  const get = async <T>(url: string): Promise<T> => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  };

  const post = async <T>(url: string, body: any): Promise<T> => {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  };

  return { get, post };
}