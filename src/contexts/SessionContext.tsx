
"use client";

import type { Session, NewSession } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { isPast, parseISO } from "date-fns";

interface SessionContextType {
  sessions: Session[];
  isLoading: boolean;
  addSession: (session: NewSession) => Promise<void>;
  updateSession: (sessionId: string, sessionData: Partial<Session>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  enrollInSession: (sessionId: string, username: string) => Promise<"enrolled" | "session_full" | "already_enrolled">;
  unenrollFromSession: (sessionId: string, username: string) => Promise<void>;
}

const initialSessions: Session[] = [
    {
      id: uuidv4(),
      title: "Evening Volleyball",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      time: "18:00",
      location: "Millburn Academy",
      capacity: 12,
      enrolledPlayers: ["Manu", "player1", "player2"],
      waitlist: [],
    },
    {
      id: uuidv4(),
      title: "Weekend Match",
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      time: "10:00",
      location: "Inverness Royal Academy",
      capacity: 12,
      enrolledPlayers: ["player3", "player4"],
      waitlist: ["player5"],
    },
    {
      id: uuidv4(),
      title: "Beginner's Clinic",
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      time: "19:00",
      location: "UHI",
      capacity: 10,
      enrolledPlayers: ["player2", "player5"],
      waitlist: [],
      score: { teamA: 2, teamB: 1 },
      teamA: ["player2", "player1"],
      teamB: ["player5", "player3"]
    }
];

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
        const storedSessions = localStorage.getItem("volley_sessions");
        if (storedSessions) {
            setSessions(JSON.parse(storedSessions));
        } else {
            setSessions(initialSessions);
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
        setSessions(initialSessions);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
        if (!isLoading) {
            localStorage.setItem("volley_sessions", JSON.stringify(sessions));
        }
    } catch (error) {
        console.error("Failed to write to localStorage", error);
    }
  }, [sessions, isLoading]);

  const addSession = async (sessionData: NewSession) => {
    const newSession: Session = {
      ...sessionData,
      id: uuidv4(),
      enrolledPlayers: [],
      waitlist: [],
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
  };

  const updateSession = async (sessionId: string, sessionData: Partial<Session>) => {
    setSessions(prevSessions =>
      prevSessions.map(s => (s.id === sessionId ? { ...s, ...sessionData } : s))
    );
  };

  const deleteSession = async (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
  };

  const enrollInSession = async (sessionId: string, username: string): Promise<"enrolled" | "session_full" | "already_enrolled"> => {
    let result: "enrolled" | "session_full" | "already_enrolled" = "session_full";
    setSessions(prevSessions => {
        const sessionIndex = prevSessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) return prevSessions;

        const sessionToUpdate = { ...prevSessions[sessionIndex] };
        
        if (sessionToUpdate.enrolledPlayers.includes(username) || sessionToUpdate.waitlist.includes(username)) {
          result = "already_enrolled";
          return prevSessions;
        }

        if (sessionToUpdate.enrolledPlayers.length < sessionToUpdate.capacity) {
            sessionToUpdate.enrolledPlayers = [...sessionToUpdate.enrolledPlayers, username];
            result = "enrolled";
        } else {
            sessionToUpdate.waitlist = [...sessionToUpdate.waitlist, username];
            result = "session_full";
        }

        const newSessions = [...prevSessions];
        newSessions[sessionIndex] = sessionToUpdate;
        return newSessions;
    });
    return result;
  };

  const unenrollFromSession = async (sessionId: string, username: string) => {
    setSessions(prevSessions => {
        const sessionIndex = prevSessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) return prevSessions;

        const sessionToUpdate = { ...prevSessions[sessionIndex] };
        const wasEnrolled = sessionToUpdate.enrolledPlayers.includes(username);

        sessionToUpdate.enrolledPlayers = sessionToUpdate.enrolledPlayers.filter(p => p !== username);
        sessionToUpdate.waitlist = sessionToUpdate.waitlist.filter(p => p !== username);

        if (wasEnrolled && sessionToUpdate.waitlist.length > 0 && sessionToUpdate.enrolledPlayers.length < sessionToUpdate.capacity) {
            const playerToPromote = sessionToUpdate.waitlist.shift();
            if(playerToPromote) {
                sessionToUpdate.enrolledPlayers.push(playerToPromote);
            }
        }
        
        if (wasEnrolled) {
            delete sessionToUpdate.teamA;
            delete sessionToUpdate.teamB;
        }

        const newSessions = [...prevSessions];
        newSessions[sessionIndex] = sessionToUpdate;
        return newSessions;
    });
  };
  
  const value = { sessions, isLoading, addSession, updateSession, deleteSession, enrollInSession, unenrollFromSession };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
