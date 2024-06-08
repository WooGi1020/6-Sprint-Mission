import instance from "@/lib/axios";
import { AxiosResponse } from "axios";

export type imageResponse = {
  url: string;
};

type ImageData = {
  image: string | File | null;
};

export async function getImageUrl(image: ImageData, token: string | null) {
  try {
    const response: AxiosResponse<imageResponse> = await instance.post("/images/upload", image, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (e) {
    console.log(`error : ${e}`);
    throw new Error();
  }
}
