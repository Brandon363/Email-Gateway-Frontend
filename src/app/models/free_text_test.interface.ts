import { BaseResponse } from "./shared.interface";

export interface ExtractedText {
  text: string;
  confidence: number;
}

export interface ExtractedTextResponse extends BaseResponse{
  text?: ExtractedText;
  texts?: ExtractedText[];
  raw_text?: string;
}