import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  loading: true,
  profileError: null,
  signOut: async () => {},
  retryFetchProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchProfile = useCallback(async (userId, retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (retryCount < 2) {
          await new Promise((r) => setTimeout(r, 1000));
          return fetchProfile(userId, retryCount + 1);
        }
        console.error("Error fetching profile:", error);
        setProfileError("Profil tidak ditemukan di database.");
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      if (retryCount < 1) {
        await new Promise((r) => setTimeout(r, 1000));
        return fetchProfile(userId, retryCount + 1);
      }
      setProfileError(err.message || "Gagal mengambil profil");
      return null;
    }
  }, []);

  const ensureProfile = useCallback(async (userId, metadata) => {
    // Coba fetch dulu
    let profile = await fetchProfile(userId);
    if (profile) {
      setProfileError(null);
      return profile;
    }

    // Jika tidak ada, buat baru
    try {
      console.log("Creating profile for:", metadata?.email || userId);
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: metadata?.full_name || "Member",
          email: metadata?.email || "",
          role: "member",
          tier: "bronze",
          points: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("Failed to auto-create profile:", createError);
        // Coba fetch sekali lagi (mungkin trigger baru jalan)
        profile = await fetchProfile(userId);
        if (profile) return profile;
        setProfileError("Gagal membuat profil. Coba lagi atau hubungi admin.");
        return null;
      }

      setProfileError(null);
      return newProfile;
    } catch (err) {
      console.error("Error in ensureProfile:", err);
      setProfileError(err.message || "Gagal membuat profil");
      return null;
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const userProfile = await ensureProfile(session.user.id, {
          full_name: session.user.user_metadata?.full_name,
          email: session.user.email,
        });

        if (mounted) {
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
          }
          setLoading(false);
        }
      } else {
        if (mounted) setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        setLoading(true);
        setProfileError(null);

        const userProfile = await ensureProfile(session.user.id, {
          full_name: session.user.user_metadata?.full_name,
          email: session.user.email,
        });

        if (mounted) {
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setProfileError(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, ensureProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    setProfileError(null);
  };

  const retryFetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    setProfileError(null);
    const userProfile = await ensureProfile(user.id, {
      full_name: user.user_metadata?.full_name,
      email: user.email,
    });
    if (userProfile) {
      setProfile(userProfile);
      setRole(userProfile.role);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        profileError,
        signOut,
        retryFetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
