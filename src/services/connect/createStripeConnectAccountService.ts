import getTutorEmailAddress from "@/firebase/tutor/general/getTutorEmailAddress";
import { z } from "zod";

const createAccountSchema = z.object({
  uid: z.string().min(1, "uid is required for creating account"),
});
const createStripeConnectAccount = async ({
  uid,
}: z.infer<typeof createAccountSchema>) => {
  const validationResult = createAccountSchema.safeParse({ uid });
  if (validationResult.error) {
    const errors = validationResult.error.errors.map((error) => {
      error.message;
    });
    return {
      type: "error",
      message: "zod error" + errors,
    };
  } else {
    const emailAddressResponse = await getTutorEmailAddress({ uid });
    if (emailAddressResponse.type === "success") {
      const emailAddress = emailAddressResponse.message;
      const response = await fetch("/api/stripe-connect/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, emailAddress }),
      });
      if (response.ok) {
        const ResponseData = await response.json();
        return {
          type: "success",
          message: "successfully created account",
          accountId: ResponseData.data.accountId,
        };
      } else {
        const errorData = await response.json();
        return {
          type: "success",
          message: "error in api while trying to create connected account",
          error: errorData,
        };
      }
    } else {
      return emailAddressResponse;
    }
  }
};

export default createStripeConnectAccount;
