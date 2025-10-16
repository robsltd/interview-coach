import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import InterviewPage from "./InterviewPage";

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error("Unable to get access token");
  }

  return <InterviewPage accessToken={accessToken} />;
}