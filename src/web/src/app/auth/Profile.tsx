import { Navigate } from "react-router";
import { useProfile } from "../../hooks/useProfile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { EditProfileForm } from "../../components/profile/EditProfileForm";
import { ChangePasswordForm } from "../../components/profile/ChangePasswordForm";

function ProfileSkeleton() {
  return (
    <section className="flex w-full max-w-2xl animate-pulse flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-2xl bg-white/6" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 rounded bg-white/6" />
          <div className="h-4 w-56 rounded bg-white/6" />
        </div>
      </div>
      <div className="h-80 rounded-xl bg-surface" />
      <div className="h-80 rounded-xl bg-surface" />
    </section>
  );
}

function Profile() {
  const {
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
  } = useProfile();

  if (isLoadingProfile) {
    return <ProfileSkeleton />;
  }

  if (loadError || !profile) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <section className="flex w-full max-w-2xl flex-col gap-4 p-4">
      <ProfileHeader
        username={profile.username}
        email={profile.email}
        createdAt={profile.createdAt}
      />

      <EditProfileForm
        username={username}
        email={email}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onSubmit={saveProfile}
        isSaving={isSavingProfile}
        isDirty={isProfileDirty}
        error={profileError}
        successMessage={profileSuccess}
      />

      <ChangePasswordForm
        oldPassword={oldPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onOldPasswordChange={setOldPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={changePassword}
        isChanging={isChangingPassword}
        error={passwordError}
        successMessage={passwordSuccess}
      />
    </section>
  );
}

export { Profile };
