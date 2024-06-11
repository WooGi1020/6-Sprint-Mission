import instance from "@/lib/instance";
import { AxiosResponse } from "axios";
import { WriterResponse } from "./getArticle.api";

export type CommentsResponse = {
  list: CommentResponse[];
  nextCursor: number;
};

export type CommentResponse = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  writer: commentWriterResponse;
};

export type commentWriterResponse = {
  image: string;
} & WriterResponse;

// 게시글 댓글 목록 받아오는 API
export async function getArticleComments(id: string | string[] | undefined, limit: 10, nextCursor: number | null) {
  try {
    const response: AxiosResponse<CommentsResponse> = await instance.get(
      `/articles/${id}/comments?limit=${limit}&cursor=${nextCursor}`
    );
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}
