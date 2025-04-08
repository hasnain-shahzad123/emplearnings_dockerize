const updateEmailVerificationService = async (email: string) => {
  try {
    const response = await fetch("/api/auth/update-email-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating email verification:", error);
    throw error;
  }
};

export default updateEmailVerificationService;