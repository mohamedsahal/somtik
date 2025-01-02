import { createContext, useContext, useState } from 'react';

type Profile = {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  likes_count: number;
  updated_at?: string;
};

type ProfileContextType = {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
  setProfile: (profile: Profile | null) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  updateProfile: () => {},
  setProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(prev => ({
      ...prev,
      ...newProfile,
    }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext); 