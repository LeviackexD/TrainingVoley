
"use client";

import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import type { User, SkillLevel, PlayerRole } from "@/lib/types";

const initialUsers: User[] = [
    { username: "Manu", skillLevel: "advanced", role: "setter", stats: { matchesPlayed: 10, wins: 8, losses: 2, pointsScored: 150 } },
    { username: "player1", skillLevel: "intermediate", role: "outside_hitter", stats: { matchesPlayed: 5, wins: 3, losses: 2, pointsScored: 75 } },
    { username: "player2", skillLevel: "beginner", role: "middle_blocker", stats: { matchesPlayed: 2, wins: 1, losses: 1, pointsScored: 20 } },
    { username: "player3", skillLevel: "advanced", role: "libero", stats: { matchesPlayed: 12, wins: 9, losses: 3, pointsScored: 10 } },
    { username: "player4", skillLevel: "intermediate", role: "opposite", stats: { matchesPlayed: 8, wins: 5, losses: 3, pointsScored: 90 } },
    { username: "player5", skillLevel: "beginner", role: "setter", stats: { matchesPlayed: 1, wins: 0, losses: 1, pointsScored: 5 } },
];

const ADMIN_USERNAMES = ["Manu"];

interface AuthContextType {
  user: User | null;
  users: User[];
  adminUsernames: string[];
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password_hash: string) => Promise<boolean>;
  register: (username: string, password_hash: string, skillLevel: SkillLevel, role: PlayerRole) => Promise<boolean>;
  logout: () => void;
  getUserByUsername: (username: string) => User | undefined;
  updateUserProfile: (username: string, profileData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUsers = localStorage.getItem("volley_users");
      const storedUser = localStorage.getItem("volley_user");
      
      const allUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      setUsers(allUsers);

      if (storedUser) {
        const loggedInUser = JSON.parse(storedUser);
        const fullUser = allUsers.find((u: User) => u.username === loggedInUser.username);
        setUser(fullUser || null);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      setUsers(initialUsers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect runs when user or users state changes, after the initial load.
    // It prevents overwriting the initial state loaded from localStorage.
    if (isLoading) return; 

    try {
        if (user) {
            // Avoid storing large avatar strings in the session user object
            const { avatarUrl, ...userToStore } = user;
            localStorage.setItem("volley_user", JSON.stringify(userToStore));
        } else {
            localStorage.removeItem("volley_user");
        }
        if (users.length > 0) {
            localStorage.setItem("volley_users", JSON.stringify(users));
        }
    } catch (error) {
        console.error("Failed to write to localStorage:", error);
    }
  }, [user, users, isLoading]);

  const login = async (username: string, password_hash: string): Promise<boolean> => {
    const foundUser = users.find(u => u.username === username);
    if (foundUser) {
        // In a real app, you'd compare a hashed password.
        // For this mock, we'll just check if a user exists.
        // NOTE: This is NOT secure.
        setUser(foundUser);
        return true;
    }
    return false;
  };

  const register = async (username: string, password_hash: string, skillLevel: SkillLevel, role: PlayerRole): Promise<boolean> => {
    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return false; // User already exists
    }
    
    const newUser: User = {
      username,
      skillLevel,
      role,
      stats: { matchesPlayed: 0, wins: 0, losses: 0, pointsScored: 0 },
      teams: [],
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };
  
  const getUserByUsername = (username: string) => {
    return users.find(u => u.username === username);
  }

  const updateUserProfile = async (username: string, profileData: Partial<User>) => {
      setUsers(prevUsers =>
        prevUsers.map(u => {
          if (u.username === username) {
            const updatedUser = { ...u, ...profileData };
            if (user && user.username === username) {
              setUser(updatedUser);
            }
            return updatedUser;
          }
          return u;
        })
      );
  }

  const isAdmin = useMemo(() => user ? ADMIN_USERNAMES.includes(user.username) : false, [user]);

  const value = { user, users, adminUsernames: ADMIN_USERNAMES, isAdmin, isLoading, login, register, logout, getUserByUsername, updateUserProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
