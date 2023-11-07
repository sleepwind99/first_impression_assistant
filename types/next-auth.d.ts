import { GetUserInfo } from "@/model/user";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    email: string;
    domain: string;
    user?: GetUserInfo;
  }

  interface JWT {
    accessToken?: string;
    email: string;
    domain: string;
    user?: User;
  }

  interface Profile {
    email?: string;
    kakao_account?: KakaoAccount;
    response?: NaverAccount;
  }

  interface KakaoAccount {
    email: string;
  }

  interface NaverAccount {
    email: string;
  }

  interface User {
    id: string;
    email: string;
    domain: string;
    username: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    isEnableMarketing: boolean;
    imageUrl?: string;
  }
}
