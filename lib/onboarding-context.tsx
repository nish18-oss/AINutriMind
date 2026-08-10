import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type OnboardingData = {
  goal: string | null;

  wakeTime: string;
  sleepTime: string;
  schedule: string;

  age: string;
  height: string;
  weight: string;

  activityLevel: string | null;
  dietPreference: string | null;

  preferences: string[];
};

type OnboardingContextType = {
  data: OnboardingData;

  updateData: (
    values: Partial<OnboardingData>
  ) => void;

  resetData: () => void;
};

const initialData: OnboardingData = {
  goal: null,

  wakeTime: "",
  sleepTime: "",
  schedule: "",

  age: "",
  height: "",
  weight: "",

  activityLevel: null,
  dietPreference: null,

  preferences: [],
};

const OnboardingContext =
  createContext<OnboardingContextType | undefined>(
    undefined
  );

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] =
    useState<OnboardingData>(initialData);

  function updateData(
    values: Partial<OnboardingData>
  ) {
    setData((current) => ({
      ...current,
      ...values,
    }));
  }

  function resetData() {
    setData(initialData);
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        resetData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside OnboardingProvider"
    );
  }

  return context;
}