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
  role: "learner" | "instructor";
}

export type NotificationChannel = "email" | "app" | "sms";

export interface Purchase {
  courseId: string;
  title: string;
  amount: number;
  purchasedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string, role?: User["role"], password?: string) => User;
  logout: () => void;
  updateProfile: (profile: { name: string; email: string }) => void;
  notificationChannel: NotificationChannel;
  setNotificationChannel: (channel: NotificationChannel) => void;
  changePassword: (currentPassword: string, newPassword: string) => string | null;
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
      const storedUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );
      return storedUser
        ? { ...storedUser, role: storedUser.role || "learner" }
        : null;
    } catch {
      return null;
    }
  });
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [notificationChannel, setNotificationChannelState] =
    useState<NotificationChannel>("email");

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
      const storedChannel = localStorage.getItem(
        accountKey(email, "notificationChannel"),
      );
      setNotificationChannelState(
        storedChannel === "app" || storedChannel === "sms" ? storedChannel : "email",
      );
    } catch {
      setEnrolledCourseIds([]);
      setPurchases([]);
      setCompletedCourseIds([]);
    }
  };

  const login = (
    email: string,
    name = "Learner",
    role?: User["role"],
    password?: string,
  ) => {
    const storedRole = localStorage.getItem(accountKey(email, "role"));
    const nextUser: User = {
      name,
      email,
      role: role || (storedRole === "instructor" ? "instructor" : "learner"),
    };
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    localStorage.setItem(accountKey(email, "role"), nextUser.role);
    if (password) localStorage.setItem(accountKey(email, "password"), password);
    loadAccountData(email);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    setEnrolledCourseIds([]);
    setPurchases([]);
    setCompletedCourseIds([]);
    setNotificationChannelState("email");
    localStorage.removeItem("currentUser");
  };

  const updateProfile = (profile: { name: string; email: string }) => {
    if (!user) return;

    const nextUser = { ...user, ...profile };
    if (profile.email !== user.email) {
      for (const key of [
        "role",
        "enrolledCourseIds",
        "purchases",
        "completedCourseIds",
        "notificationChannel",
        "password",
      ]) {
        const previousKey = accountKey(user.email, key);
        const nextKey = accountKey(profile.email, key);
        const storedValue = localStorage.getItem(previousKey);
        if (storedValue !== null) localStorage.setItem(nextKey, storedValue);
      }
    }
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
  };

  const setNotificationChannel = (channel: NotificationChannel) => {
    if (!user) return;
    setNotificationChannelState(channel);
    localStorage.setItem(accountKey(user.email, "notificationChannel"), channel);
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return "You must be signed in to change your password.";
    const storedPassword = localStorage.getItem(accountKey(user.email, "password"));
    if (storedPassword && storedPassword !== currentPassword) {
      return "Your current password is incorrect.";
    }
    localStorage.setItem(accountKey(user.email, "password"), newPassword);
    return null;
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
        notificationChannel,
        setNotificationChannel,
        changePassword,
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
