
import axios, { AxiosRequestConfig } from "axios";

export async function request<T>(url: string, options: AxiosRequestConfig = { method: "get" }): Promise<T> {
  const opts = { ...options, url };
  if (opts.params) {
    opts.params = { ...opts.params, format: "json" };
  }
  try {

    const resopose = await axios(opts);

    if (resopose.status <= 300) {
      return resopose.data as T;
    } else {
      throw new Error(resopose.statusText);
    }
  } catch (error) {
    throw new Error(error);
  }
}