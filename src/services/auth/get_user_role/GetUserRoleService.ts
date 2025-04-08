const getUserRoleService = async (email: string) => {
  try {
    console.log("getUserRoleService: Starting with email:", email);

    const response = await fetch("/api/auth/get-user-role", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    console.log("API Response status:", response.status);

    if (!response.ok) {
      console.error("API Response not ok:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);
    
    if (data.type === "error") {
      console.error("API Error:", data.message);
      return { redirectTo: "/select-user-type", role: null };
    }

    console.log("Processing role:", data.role);
    if (data.role === "student") {
      console.log("Redirecting to student login");
      return { redirectTo: "/student-login", role: data.role };
    } else if (data.role === "tutor") {
      console.log("Redirecting to tutor login");
      return { redirectTo: "/login", role: data.role };
    }

    console.log("No specific role found, redirecting to select-user-type");
    return { redirectTo: "/select-user-type", role: null };
  } catch (error) {
    console.error("Error in getUserRoleService:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { redirectTo: "/select-user-type", role: null };
  }
};

export default getUserRoleService;
