import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { FreelancerProfile, UserAccount } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userAccount: UserAccount | null;
  freelancerProfile: FreelancerProfile | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  saveFreelancerProfile: (profile: Partial<FreelancerProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sync user and profile from Firestore
  const syncUserData = async (currentUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      const now = new Date().toISOString();
      let accountData: UserAccount;

      if (!userSnap.exists()) {
        accountData = {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Freelancer',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || undefined,
          createdAt: now,
          updatedAt: now,
        };
        try {
          await setDoc(userRef, accountData);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      } else {
        accountData = userSnap.data() as UserAccount;
      }
      setUserAccount(accountData);

      // Fetch freelancer profile
      const profileRef = doc(db, 'freelancerProfiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setFreelancerProfile(profileSnap.data() as FreelancerProfile);
      } else {
        // Create initial default freelancer profile
        const defaultProfile: FreelancerProfile = {
          uid: currentUser.uid,
          category: 'Web & Software Development',
          skills: 'React, TypeScript, Web Development',
          experienceLevel: 'Intermediate (2-4 yrs)',
          preferredLocations: 'Worldwide',
          remotePreference: 'Remote Only',
          bio: 'Passionate freelancer seeking high-impact client projects and remote contracts.',
          updatedAt: now,
        };
        try {
          await setDoc(profileRef, defaultProfile);
          setFreelancerProfile(defaultProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `freelancerProfiles/${currentUser.uid}`);
        }
      }
    } catch (err: any) {
      console.error('Error synchronizing user data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserData(currentUser);
      } else {
        setUserAccount(null);
        setFreelancerProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      // Send verification email
      try {
        await sendEmailVerification(cred.user);
      } catch (e) {
        console.warn('Failed to send verification email:', e);
      }
    } catch (err: any) {
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return; // User cancelled popup, do not show error
      }
      const msg = err.message || 'Google sign-in failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const msg = err.message || 'Failed to send password reset email.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
    }
  };

  const saveFreelancerProfile = async (updatedData: Partial<FreelancerProfile>) => {
    if (!user) throw new Error('Not authenticated');
    setError(null);
    const profileRef = doc(db, 'freelancerProfiles', user.uid);
    const newProfile: FreelancerProfile = {
      ...(freelancerProfile || {
        uid: user.uid,
        category: 'Freelancer',
        skills: '',
        experienceLevel: 'Intermediate',
        preferredLocations: 'Worldwide',
        remotePreference: 'Remote',
        bio: '',
      }),
      ...updatedData,
      uid: user.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(profileRef, newProfile, { merge: true });
      setFreelancerProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `freelancerProfiles/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userAccount,
        freelancerProfile,
        loading,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        resendVerificationEmail,
        logout,
        saveFreelancerProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
