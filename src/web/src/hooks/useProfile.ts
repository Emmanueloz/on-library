import { use, useEffect, useState } from "react";
import type { IUserPayload } from "@on-library/shared";
import { AuthContext } from "../context/AuthContex";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";
import { useLocalStorage } from "./useLocalStorage";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const useProfile = () => {
  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("useProfile must be used within a AuthProvider");
  }

  const { user, token, isAuthenticated, setUser } = authContext;

  const [, setStoredUser] = useLocalStorage<IUserPayload | null>(
    "auth_user",
    null,
  );

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const res = await fetch(`${configEnv.apiUrl}/api/auth/profile`, {
          method: "GET",
          headers,
        });

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = (await res.json()) as ProfileData;
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
        setLoadError(null);
      } catch (error) {
        setLoadError(`${error}`);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!profileSuccess) return;
    const timeout = setTimeout(() => setProfileSuccess(null), 4000);
    return () => clearTimeout(timeout);
  }, [profileSuccess]);

  useEffect(() => {
    if (!passwordSuccess) return;
    const timeout = setTimeout(() => setPasswordSuccess(null), 4000);
    return () => clearTimeout(timeout);
  }, [passwordSuccess]);

  const isProfileDirty =
    profile !== null &&
    (username.trim() !== profile.username || email.trim() !== profile.email);

  const saveProfile = async (): Promise<boolean> => {
    if (!profile || isSavingProfile) return false;

    setProfileError(null);
    setProfileSuccess(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setProfileError("Username is required");
      return false;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setProfileError("Enter a valid email address");
      return false;
    }

    const body: { username?: string; email?: string } = {};
    if (trimmedUsername !== profile.username) body.username = trimmedUsername;
    if (trimmedEmail !== profile.email) body.email = trimmedEmail;

    if (Object.keys(body).length === 0) return false;

    try {
      setIsSavingProfile(true);
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/auth/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || "Failed to update profile");
        return false;
      }

      const updated = data as ProfileData;
      setProfile(updated);
      setUsername(updated.username);
      setEmail(updated.email);

      if (user) {
        const nextUser: IUserPayload = {
          ...user,
          username: updated.username,
          email: updated.email,
        };
        setUser(nextUser);
        setStoredUser(nextUser);
      }

      setProfileSuccess("Profile updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      setProfileError("An unexpected error occurred");
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const changePassword = async (): Promise<boolean> => {
    if (isChangingPassword) return false;

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword) {
      setPasswordError("Current password is required");
      return false;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (oldPassword === newPassword) {
      setPasswordError("New password must be different from the current one");
      return false;
    }

    try {
      setIsChangingPassword(true);
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/auth/profile/password`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ oldPassword, newPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "Failed to change password");
        return false;
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully");
      return true;
    } catch (error) {
      console.error(error);
      setPasswordError("An unexpected error occurred");
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    profile,
    isLoadingProfile,
    loadError,
    username,
    setUsername,
    email,
    setEmail,
    isProfileDirty,
    isSavingProfile,
    profileError,
    profileSuccess,
    saveProfile,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    passwordSuccess,
    changePassword,
  };
};

export { useProfile };
export type { ProfileData };
