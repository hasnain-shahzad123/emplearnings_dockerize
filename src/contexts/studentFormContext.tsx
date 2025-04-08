"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

interface FormData {
  step1: {
    firstName: string;
    lastName: string;
    email: string;
  };
  step2: {
    category: string;
  };
  step3: { [key: number]: string[] };
}

interface FormState {
  formData: FormData;
}

type FormAction =
  | { type: "SET_STEP1"; payload: FormData["step1"] }
  | { type: "SET_STEP2"; payload: FormData["step2"] }
  | { type: "SET_STEP3"; payload: FormData["step3"] }
  | { type: "RESET" };

const initialState: FormState = {
  formData: {
    step1: {
      firstName: "",
      lastName: "",
      email: "",
    },
    step2: {
      category: "",
    },
    step3: {},
  },
};

const FormContext = createContext<
  | {
      state: FormState;
      dispatch: React.Dispatch<FormAction>;
    }
  | undefined
>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_STEP1":
      return {
        ...state,
        formData: {
          ...state.formData,
          step1: action.payload,
        },
      };
    case "SET_STEP2":
      return {
        ...state,
        formData: {
          ...state.formData,
          step2: action.payload,
        },
      };
    case "SET_STEP3":
      return {
        ...state,
        formData: {
          ...state.formData,
          step3: action.payload,
        },
      };
    case "RESET":
      if (typeof window !== "undefined") {
        localStorage.removeItem("formState");
      }
      return initialState;
    default:
      return state;
  }
}

export function StudentFormProvider({ children }: { children: ReactNode }) {
  // Loading initial state from localStorage if available
  const savedState =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("formState") || "null")
      : null;

  const [state, dispatch] = useReducer(formReducer, savedState || initialState);

  // Saving state changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formState", JSON.stringify(state));
    }
  }, [state]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
