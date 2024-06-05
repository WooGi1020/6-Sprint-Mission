import instance from "@/lib/axios";
import { AxiosResponse } from "axios";
import { ArticleValue } from "@/pages/boards/addBoards";

export type ArticleResponse = {
  id: number;
  title: string;
  content: string;
  image: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  writer: WriterResponse;
};

export type WriterResponse = {
  id: number;
  nickname: string;
};

export type ArticlesResponse = {
  list: ArticleResponse[];
  totalCount: number;
};

// 게시글 목록 받아오는 API
export async function getArticles({
  orderBy = "recent",
  keyword = "",
}: {
  orderBy?: string | string[];
  keyword?: string | string[];
}) {
  const formattedOrderBy = Array.isArray(orderBy) ? orderBy[0] : orderBy;
  const formattedKeyword = Array.isArray(keyword) ? keyword[0] : keyword;

  const params = new URLSearchParams({
    orderBy: formattedOrderBy,
    keyword: formattedKeyword,
  });
  try {
    const response: AxiosResponse<ArticlesResponse> = await instance.get(`?${params.toString()}`);
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}

// 단일 게시글 받아오는 API
export async function getArticle(id: string | string[] | undefined) {
  try {
    const response: AxiosResponse<ArticleResponse> = await instance.get(`/${id}`);
    return response.data;
  } catch (e) {
    console.log(`error : ${e}`);
    throw new Error();
  }
}

// 베스트 게시글 목록 받아오는 API
export async function getBestArticles(pageSize: number) {
  const params = new URLSearchParams({
    page: "1",
    pageSize: pageSize.toString(),
    orderBy: "like",
  });
  try {
    const response: AxiosResponse<ArticlesResponse> = await instance.get(`?${params.toString()}`);
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}

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
export async function getArticleComments(id: string | string[] | undefined, limit: 10) {
  try {
    const response: AxiosResponse<CommentsResponse> = await instance.get(`/${id}/comments?limit=${limit}`);
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}

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

// 게시글 등록용 POST API
export async function postArticle(formData: ArticleValue) {
  try {
    const response: AxiosResponse<FormDataResponse> = await instance.post(``, formData);
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}
