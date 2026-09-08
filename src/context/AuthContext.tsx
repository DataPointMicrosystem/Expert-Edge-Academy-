import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Purchase {
  courseId: string;
  title: string;
  amount: number;
  purchasedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (profile: { name: string; email: string }) => void;
  enroll: (courseIds: string[], purchases?: Purchase[]) => void;
  isEnrolled: (courseId: string) => boolean;
  purchases: Purchase[];
  referralCode: string;
  referralBalance: number;
  markCourseComplete: (courseId: string) => void;
  isCourseComplete: (courseId: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);

  const accountKey = (email: string, key: string) => `${key}:${email}`;

  const loadAccountData = (email: string) => {
    try {
      setEnrolledCourseIds(
        JSON.parse(
          localStorage.getItem(accountKey(email, "enrolledCourseIds")) || "[]",
        ),
      );
      setPurchases(
        JSON.parse(
          localStorage.getItem(accountKey(email, "purchases")) || "[]",
        ),
      );
      setCompletedCourseIds(
        JSON.parse(
          localStorage.getItem(accountKey(email, "completedCourseIds")) || "[]",
        ),
      );
    } catch {
      setEnrolledCourseIds([]);
      setPurchases([]);
      setCompletedCourseIds([]);
    }
  };

  const login = (email: string, name = "Learner") => {
    const nextUser = { name, email };
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    loadAccountData(email);
  };

  const logout = () => {
    setUser(null);
    setEnrolledCourseIds([]);
    setPurchases([]);
    setCompletedCourseIds([]);
    localStorage.removeItem("currentUser");
  };

  const updateProfile = (profile: { name: string; email: string }) => {
    const nextUser = { ...user, ...profile };
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
  };

  const enroll = (courseIds: string[], newPurchases: Purchase[] = []) => {
    setEnrolledCourseIds((previous) => {
      const next = Array.from(new Set([...previous, ...courseIds]));
      if (user) {
        localStorage.setItem(
          accountKey(user.email, "enrolledCourseIds"),
          JSON.stringify(next),
        );
      }
      return next;
    });
    setPurchases((previous) => {
      const next = [
        ...previous,
        ...newPurchases.filter(
          (purchase) =>
            !previous.some((item) => item.courseId === purchase.courseId),
        ),
      ];
      if (user)
        localStorage.setItem(
          accountKey(user.email, "purchases"),
          JSON.stringify(next),
        );
      return next;
    });
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);
  const referralCode = user
    ? `${user.name.replace(/\s/g, "").slice(0, 5).toUpperCase()}20`
    : "LEARN20";
  const referralBalance = purchases.length * 2500;

  const markCourseComplete = (courseId: string) => {
    setCompletedCourseIds((previous) => {
      const next = Array.from(new Set([...previous, courseId]));
      if (user)
        localStorage.setItem(
          accountKey(user.email, "completedCourseIds"),
          JSON.stringify(next),
        );
      return next;
    });
  };

  const isCourseComplete = (courseId: string) =>
    completedCourseIds.includes(courseId);

  useEffect(() => {
    if (user) loadAccountData(user.email);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        enroll,
        isEnrolled,
        purchases,
        referralCode,
        referralBalance,
        markCourseComplete,
        isCourseComplete,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
