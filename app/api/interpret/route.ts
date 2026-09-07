import { handleInterpretRequest } from "@/lib/api.js";

export const runtime = "edge";

export async function POST(request: Request) {
  return handleInterpretRequest(request);
}
