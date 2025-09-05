


export type EnrolledPlayer = string;

export interface Session {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  enrolledPlayers: EnrolledPlayer[];
  waitlist: string[];
  score?: { teamA: number; teamB: number };
  teamA?: string[];
  teamB?: string[];
  roleLimits?: Record<PlayerRole, number>;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type PlayerRole = "setter" | "outside_hitter" | "opposite" | "middle_blocker" | "libero";

export interface User {
  username: string;
  skillLevel?: SkillLevel;
  role?: PlayerRole;
  stats?: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    pointsScored: number;
  };
  teams?: string[];
  avatarUrl?: string;
}

export interface Team {
    id: string;
    name: string;
    players: string[];
    captain: string;
}

export type NewSession = Omit<Session, "id" | "enrolledPlayers" | "waitlist" | "roleLimits">;
