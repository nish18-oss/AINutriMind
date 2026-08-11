import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type OnboardingData = {
  onboardingCompleted: boolean;

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

  isLoaded: boolean;
};

const STORAGE_KEY = "@ainutrimind_onboarding";

const initialData: OnboardingData = {
  onboardingCompleted: false,

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

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(data);
    }
  }, [data, isLoaded]);

  async function loadData() {
    try {
      const saved =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: Partial<OnboardingData> =
          JSON.parse(saved);

        setData({
          ...initialData,
          ...parsed,
        });
      }
    } catch (error) {
      console.log(
        "Could not load onboarding data:",
        error
      );
    } finally {
      setIsLoaded(true);
    }
  }

  async function saveData(
    value: OnboardingData
  ) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(value)
      );
    } catch (error) {
      console.log(
        "Could not save onboarding data:",
        error
      );
    }
  }

  function updateData(
    values: Partial<OnboardingData>
  ) {
    setData((current) => ({
      ...current,
      ...values,
    }));
  }

  async function resetData() {
    try {
      await AsyncStorage.removeItem(
        STORAGE_KEY
      );

      setData(initialData);
    } catch (error) {
      console.log(
        "Could not reset onboarding data:",
        error
      );
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        resetData,
        isLoaded,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context =
    useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside OnboardingProvider"
    );
  }

  return context;
}