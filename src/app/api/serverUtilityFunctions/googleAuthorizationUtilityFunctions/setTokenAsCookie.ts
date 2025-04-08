import { cookies } from "next/headers";
import z from "zod";

const tokenData = z.object({
  accessToken: z.string().min(1, "accessToken is required"),
  expiresIn: z.number().min(1, "expiresIn should be a positive integer "),
});
const setTokenAsCookie = async ({
  accessToken,
  expiresIn,
}: {
  accessToken: string;
  expiresIn: number;
}) => {
  try {
    //validating data
    tokenData.parse({ accessToken, expiresIn });
    const cookieStore = await cookies();
    //setting access token in cookies
    cookieStore.set("calendarAccessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    //formatting access token's expiry to be stored
    const calendarAccessTokenExpiry = (
      Date.now() +
      expiresIn * 1000
    ).toString();
    //setting access token's expiry
    cookieStore.set("calendarAccessTokenExpiry", calendarAccessTokenExpiry, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    return { message: "access token set successfully", type: "success" };
  } catch (error: any) {
    return { message: error.message, type: "error" };
  }
};
export default setTokenAsCookie;
