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

export interface OrderQuery {
  orderBy?: string | string[];
  keyword?: string | string[];
  page?: string | string[];
}

// 게시글 목록 받아오는 API
export async function getArticles({ orderBy = "recent", keyword = "", page = "1" }: OrderQuery) {
  const formattedOrderBy = Array.isArray(orderBy) ? orderBy[0] : orderBy;
  const formattedKeyword = Array.isArray(keyword) ? keyword[0] : keyword;
  const formattedPage = Array.isArray(page) ? page[0] : page;

  const params = new URLSearchParams({
    orderBy: formattedOrderBy,
    keyword: formattedKeyword,
    pageSize: "5",
    page: formattedPage,
  });
  try {
    const response: AxiosResponse<ArticlesResponse> = await instance.get(`/articles?${params.toString()}`);
    return response.data;
  } catch (e) {
    console.error(`error : ${e}`);
    throw new Error();
  }
}

// 단일 게시글 받아오는 API
export async function getArticle(id: string | string[] | undefined) {
  try {
    const response: AxiosResponse<ArticleResponse> = await instance.get(`/articles/${id}`);
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
    const response: AxiosResponse<ArticlesResponse> = await instance.get(`/articles?${params.toString()}`);
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
    const response: AxiosResponse<CommentsResponse> = await instance.get(`/articles/${id}/comments?limit=${limit}`);
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

interface SignUpFormData {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface SignResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    image: null | string;
    nickname: string;
    updatedAt: Date;
    createdAt: Date;
  };
}

// 회원가입 및 로그인 API
export async function postSignUp(formData: SignUpFormData) {
  try {
    const response: AxiosResponse<SignResponse> = await instance.post("/auth/signUp", formData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.error(`error: ${e}`);
    throw new Error();
  }
}

export async function postSignIn(formData: SignInFormData) {
  try {
    const response: AxiosResponse<SignResponse> = await instance.post("/auth/signIn", formData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (e) {
    console.error(`error: ${e}`);
    throw new Error();
  }
}

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
