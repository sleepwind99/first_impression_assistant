import { HttpResponse } from "./reponse";

export interface UserErrorMessage {
  languageCode: "en" | "kr"; // Language Code in Request
  userMsgTitle: string; // User Message Title
  userMsgContent: string; // User Message Content
}

export interface ResponseError {
  timestamp: Date; // Timestamp of Error Occurred
  location: string; // Location of Error Occurred
  message: string; // Message for Debugger
  userMsgList: UserErrorMessage[]; // Return Localized User Message (Use in Client)
}
