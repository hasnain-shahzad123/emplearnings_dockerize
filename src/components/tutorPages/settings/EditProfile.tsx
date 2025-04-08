import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Spinner from "@/components/shared/spinner/Spinner";
import updateUsernameInDb from "@/firebase/auth/updateUsernameInDb";

interface ProfileFormValues {
  username?: string;
  email?: string;
  password?: string;
  currentPassword: string;
}

interface EditProfileProps {
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isLoading?: boolean;
  userRole: "tutor" | "student";
}

const EditProfile: React.FC<EditProfileProps> = ({
  onSubmit,
  isLoading = false,
  userRole,
}) => {
  const [user, setUser] = useState<any>(null);
  const [updateMode, setUpdateMode] = useState<
    "username" | "email" | "password" | null
  >(null);
  const [initialValues, setInitialValues] = useState({
    username: "",
    email: "",
    password: "",
    currentPassword: "",
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setInitialValues({
        username: currentUser.displayName || "",
        email: currentUser.email || "",
        password: "",
        currentPassword: "",
      });
    }
  }, []);

  const validateForm = (values: ProfileFormValues) => {
    const errors: Partial<Record<keyof ProfileFormValues, string>> = {};

    if (
      updateMode === "username" &&
      (!values.username || values.username.length < 3)
    ) {
      errors.username = "Username must be at least 3 characters";
    }

    if (
      updateMode === "email" &&
      (!values.email ||
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
    ) {
      errors.email = "Please enter a valid email";
    }

    if (
      updateMode === "password" &&
      (!values.password || values.password.length < 8)
    ) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!values.currentPassword) {
      errors.currentPassword = "Current password is required";
    } else if (values.currentPassword.length < 8) {
      errors.currentPassword = "Current password must be at least 8 characters";
    }

    return errors;
  };

  const handleFormSubmit = async (values: ProfileFormValues) => {
    // Only include fields that are being updated based on the mode
    const updatedData: ProfileFormValues = {
      currentPassword: values.currentPassword,
    };

    if (
      updateMode === "username" &&
      values.username &&
      values.username !== user?.displayName
    ) {
      updatedData.username = values.username;
      // We'll update the username in the database after auth update succeeds
    }

    if (
      updateMode === "email" &&
      values.email &&
      values.email !== user?.email
    ) {
      updatedData.email = values.email;
    }

    if (updateMode === "password" && values.password) {
      updatedData.password = values.password;
    }

    try {
      // First update in Firebase Auth
      await onSubmit(updatedData);
      // After successful auth update, update in database if it was a username change
      if (updateMode === "username" && values.username) {
        const result = await updateUsernameInDb({
          uid: user.uid,
          username: values.username,
          role: userRole,
        });
        if (!result.success) {
          console.error("Database update failed:", result.message);
        }
      }

      // Reset update mode after submission
      setUpdateMode(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <Spinner size="md" />;
  }

  return (
    <div className="space-y-6">
      {/* Update mode selection buttons */}
      {!updateMode && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            What would you like to update?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setUpdateMode("username")}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
            >
              Update Username
            </button>
            <button
              type="button"
              onClick={() => setUpdateMode("email")}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
            >
              Update Email
            </button>
            <button
              type="button"
              onClick={() => setUpdateMode("password")}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Form appears only when an update mode is selected */}
      {updateMode && (
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="space-y-6 max-w-md">
              <h3 className="text-lg font-medium">
                {updateMode === "username"
                  ? "Update Username"
                  : updateMode === "email"
                  ? "Update Email"
                  : "Update Password"}
              </h3>

              {/* Username field - only shown when updating username */}
              {updateMode === "username" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              )}

              {/* Email field - only shown when updating email */}
              {updateMode === "email" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    A verification email will be sent to your new email address.
                    A notification will also be sent to your current email (
                    {auth.currentUser?.email}).
                  </p>
                </div>
              )}

              {/* Password field - only shown when updating password */}
              {updateMode === "password" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              )}

              {/* Current password field - always required for verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span> Current Password
                  (required for verification)
                </label>
                <Field
                  type="password"
                  name="currentPassword"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <ErrorMessage
                  name="currentPassword"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isLoading ? <Spinner size="sm" /> : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateMode(null)}
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EditProfile;
