import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ReportStatus =
  | "pending"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ReportCategory =
  | "garbage"
  | "pothole"
  | "graffiti"
  | "drainage"
  | "street_light"
  | "other";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: string;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  userId: string;
  userName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  reportsCount: number;
  resolvedCount: number;
  joinedAt: string;
  badge: "newcomer" | "contributor" | "champion" | "hero";
}

interface AppContextType {
  user: User | null;
  reports: Report[];
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt" | "status" | "upvotes" | "userId" | "userName">) => void;
  upvoteReport: (reportId: string) => void;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Large pile of garbage near park",
    description: "There is a large pile of garbage dumped near the entrance of City Park. It has been there for 3 days now and is causing a bad odor.",
    category: "garbage",
    status: "in_progress",
    location: "City Park, MG Road",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 24,
    userId: "user2",
    userName: "Rahul Sharma",
  },
  {
    id: "2",
    title: "Deep pothole on Main Street",
    description: "A very deep pothole has appeared on Main Street causing damage to vehicles. Urgent repair needed.",
    category: "pothole",
    status: "pending",
    location: "Main Street, Near Bus Stop 12",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 41,
    userId: "user3",
    userName: "Priya Singh",
  },
  {
    id: "3",
    title: "Broken street light",
    description: "Three street lights near the school are broken. Creating safety hazard for children walking at night.",
    category: "street_light",
    status: "resolved",
    location: "School Road, Near DPS",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 18,
    userId: "user4",
    userName: "Amit Kumar",
  },
  {
    id: "4",
    title: "Blocked drainage causing flooding",
    description: "The drainage near the market is completely blocked. Even small rains are causing water logging on the road.",
    category: "drainage",
    status: "pending",
    location: "Market Area, Sector 5",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 56,
    userId: "user5",
    userName: "Sunita Patel",
  },
  {
    id: "5",
    title: "Graffiti on public building wall",
    description: "Vandalism on the wall of the community center. Graffiti has been painted overnight.",
    category: "graffiti",
    status: "in_progress",
    location: "Community Center, Block C",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    upvotes: 9,
    userId: "user6",
    userName: "Vikram Nair",
  },
  {
    id: "6",
    title: "Overflowing garbage bin at bus stand",
    description: "The garbage bin at the main bus stand is overflowing for the past 2 days. Waste is spreading on the road.",
    category: "garbage",
    status: "resolved",
    location: "Bus Stand, Central Area",
    imageUri: undefined,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    upvotes: 33,
    userId: "user7",
    userName: "Meena Verma",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedUser, storedOnboarding, storedReports] = await Promise.all([
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("hasSeenOnboarding"),
          AsyncStorage.getItem("reports"),
        ]);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedOnboarding === "true") setHasSeenOnboarding(true);
        if (storedReports) {
          const parsed = JSON.parse(storedReports) as Report[];
          setReports([...parsed, ...MOCK_REPORTS]);
        }
      } catch {}
      setIsLoading(false);
    };
    loadData();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const newUser: User = {
      id: "current-user",
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      points: 120,
      reportsCount: 5,
      resolvedCount: 3,
      joinedAt: new Date().toISOString(),
      badge: "contributor",
    };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: "current-user",
      name,
      email,
      points: 0,
      reportsCount: 0,
      resolvedCount: 0,
      joinedAt: new Date().toISOString(),
      badge: "newcomer",
    };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
  }, []);

  const addReport = useCallback((reportData: Omit<Report, "id" | "createdAt" | "updatedAt" | "status" | "upvotes" | "userId" | "userName">) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      userId: user?.id ?? "anonymous",
      userName: user?.name ?? "Anonymous",
    };
    setReports((prev) => [newReport, ...prev]);
    setUser((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        reportsCount: prev.reportsCount + 1,
        points: prev.points + 10,
      };
      AsyncStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
    AsyncStorage.getItem("reports").then((stored) => {
      const current: Report[] = stored ? JSON.parse(stored) : [];
      AsyncStorage.setItem("reports", JSON.stringify([newReport, ...current]));
    });
  }, [user]);

  const upvoteReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.map((r) => r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r)
    );
  }, []);

  const updateReportStatus = useCallback((reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => r.id === reportId ? { ...r, status, updatedAt: new Date().toISOString() } : r)
    );
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      reports,
      isAuthenticated: !!user,
      hasSeenOnboarding,
      login,
      register,
      logout,
      completeOnboarding,
      addReport,
      upvoteReport,
      updateReportStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
