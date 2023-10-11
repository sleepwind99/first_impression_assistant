export interface PostDefaultUser {
  uid: string;
  email: string;
  domain: string;
}

export interface PostUser {
  username: string;
  isEnableMarketing: boolean;
  name: string;
  imageUrl?: string;
}

export interface GetUserProfilePreview extends PostUser {
  email: string;
  isRemoved: boolean;
  removedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserProfileDetail extends GetUserProfilePreview {
  introduction?: string;
  name: string;
  company?: string;
  nation?: string;
}

export interface GetUserInfo extends GetUserProfilePreview {
  uid: string;
  name: string;
  email: string;
  isEnableMarketing: boolean;
  enableMarketingAt?: Date;
  isRegistered: boolean;
}
