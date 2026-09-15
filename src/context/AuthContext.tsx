import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  apiRequest,
  clearAuthSession,
  getAccessToken,
  type ApiUser,
  type AuthResponse,
} from "../lib/api";

interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: "learner" | "instructor" | "admin";
  isVerified?: boolean;
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
  login: (email: string, password: string) => Promise<User>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    role: User["role"],
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: { name: string; email: string }) => void;
  notificationChannel: NotificationChannel;
  setNotificationChannel: (channel: NotificationChannel) => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => string | null;
  enroll: (courseIds: string[], purchases?: Purchase[]) => void;
  isEnrolled: (courseId: string) => boolean;
  purchases: Purchase[];
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

  const mapUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    name: apiUser.fullName,
    email: apiUser.email,
    avatar: apiUser.avatar,
    role:
      apiUser.role === "instructor"
        ? "instructor"
        : apiUser.role === "admin"
          ? "admin"
          : "learner",
    isVerified: apiUser.isVerified,
  });

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
        storedChannel === "app" || storedChannel === "sms"
          ? storedChannel
          : "email",
      );
    } catch {
      setEnrolledCourseIds([]);
      setPurchases([]);
      setCompletedCourseIds([]);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const nextUser = mapUser(response.data.user);
    localStorage.setItem("accessToken", response.data.token);
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    loadAccountData(email);
    return nextUser;
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: User["role"],
  ) => {
    await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
        role: role === "instructor" ? "instructor" : "student",
      }),
    });
  };

  const logout = () => {
    setUser(null);
    setEnrolledCourseIds([]);
    setPurchases([]);
    setCompletedCourseIds([]);
    setNotificationChannelState("email");
    clearAuthSession();
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
    localStorage.setItem(
      accountKey(user.email, "notificationChannel"),
      channel,
    );
  };

  const changePassword = (_currentPassword: string, _newPassword: string) =>
    user ? null : "You must be signed in to change your password.";

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

  useEffect(() => {
    if (!getAccessToken()) return;
    apiRequest<{ data: ApiUser }>("/users/me")
      .then((response) => {
        const nextUser = mapUser(response.data);
        setUser(nextUser);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      })
      .catch(() => {
        clearAuthSession();
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        notificationChannel,
        setNotificationChannel,
        changePassword,
        enroll,
        isEnrolled,
        purchases,
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
