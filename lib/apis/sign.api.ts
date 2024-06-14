import instance from "@/lib/instance";
import { AxiosResponse, AxiosError } from "axios";

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
export async function signUp(formData: SignUpFormData) {
  try {
    const response: AxiosResponse<SignResponse> = await instance.post("/auth/signUp", formData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (e: unknown) {
    const error = e as AxiosError;
    if (error.response?.status === 400) {
      alert("회원가입 실패!");
    }
  }
}

export async function signIn(formData: SignInFormData) {
  try {
    const response: AxiosResponse<SignResponse> = await instance.post("/auth/signIn", formData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (e: unknown) {
    if (e) {
      const error = e as AxiosError;
      if (error.response?.status === 400) {
        alert("로그인 실패!");
      }
    }
  }
}
