import instance from "@/lib/axios";
import { AxiosResponse } from "axios";

type FormDataResponse = {
  updatedAt: string;
  createdAt: string;
  likeCount: number;
  writer: {
    nickname: string;
    id: number;
  };
  image: string;
  content: string;
  title: string;

  id: number;
};

interface ArticleFormData {
  title?: string;
  content?: string;
  image?: string | null;
}

// 게시글 등록용 POST API
export async function postArticle(formData: ArticleFormData, token: string | null) {
  try {
    const response: AxiosResponse<FormDataResponse> = await instance.post(`/articles`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}
