import imageInstance from "../imageInstance";
import { AxiosResponse } from "axios";

export type imageResponse = {
  url: string;
};

type ImageData = {
  image: string | File | null;
};

export async function getImageUrl(image: ImageData) {
  try {
    const response: AxiosResponse<imageResponse> = await imageInstance.post("/images/upload", image);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (e) {
    console.log(`error : ${e}`);
    throw new Error();
  }
}
