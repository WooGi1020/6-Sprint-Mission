import instance from "@/lib/axios";
import { AxiosResponse } from "axios";

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
