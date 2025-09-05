
"use client";

import { Calendar, Clock, MapPin, Users, MoreVertical, Trash2, Edit, UserMinus, RefreshCw, Users2, ArrowLeft, UserPlus } from "lucide-react";
import { format, parseISO } from "date-fns";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@/lib/types";
import { useAuth, useSessions } from "@/lib/hooks";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
}

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

export function SessionCard({ session, onEdit }: SessionCardProps) {
  const { user, isAdmin, getUserByUsername } = useAuth();
  const { enrollInSession, unenrollFromSession, deleteSession, updateSession } = useSessions();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);


  const isEnrolled = user ? session.enrolledPlayers.includes(user.username) : false;
  const isOnWaitlist = user ? session.waitlist.includes(user.username) : false;
  const isFull = session.enrolledPlayers.length >= session.capacity;

  const isPast = new Date(session.date) < new Date() && !isToday(new Date(session.date));
  
  const handleEnroll = async () => {
    if (!user) return;
    const result = await enrollInSession(session.id, user.username);
    if (result === 'enrolled') {
        toast({
          title: "Successfully enrolled!",
          description: `You are signed up for ${session.title}.`,
        });
    } else if (result === 'session_full') {
        toast({
            title: "Added to waitlist",
            description: "The session is full, you have been added to the waitlist.",
        });
    } else if (result === 'already_enrolled') {
         toast({
            variant: "destructive",
            title: "Already enrolled",
            description: "You are already signed up for this session.",
        });
    }
  };


  const handleUnenroll = async () => {
    if (!user) return;
    await unenrollFromSession(session.id, user.username);
    toast({ title: "Withdrawn", description: `You've withdrawn from ${session.title}.` });
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSession(session.id);
    toast({ title: "Session Deleted", description: `${session.title} has been removed.` });
    setIsDeleting(false);
  }

  const handleGenerateTeams = async () => {
    const skillValue = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    
    const playersWithSkill = session.enrolledPlayers.map(username => {
        const playerUser = getUserByUsername(username);
        return {
            username: username,
            skill: playerUser?.skillLevel ? skillValue[playerUser.skillLevel] : 1
        };
    }).sort(() => 0.5 - Math.random()); 

    playersWithSkill.sort((a, b) => b.skill - a.skill);

    let teamA: string[] = [];
    let teamB: string[] = [];
    let skillA = 0;
    let skillB = 0;

    playersWithSkill.forEach(player => {
        if (skillA <= skillB) {
            teamA.push(player.username);
            skillA += player.skill;
        } else {
            teamB.push(player.username);
            skillB += player.skill;
        }
    });

    await updateSession(session.id, { teamA, teamB });
    toast({ title: "Teams Generated", description: "Balanced teams have been created." });
  }
  
  const handleBackToPlayers = async () => {
    await updateSession(session.id, { teamA: undefined, teamB: undefined });
    toast({ title: "Teams Cleared", description: "Returned to player list." });
  }


  const handleSwapPlayer = async (playerToSwap: string, currentTeam: 'A' | 'B', swapWithPlayer: string) => {
    if (!session.teamA || !session.teamB) return;
  
    let newTeamA = [...session.teamA];
    let newTeamB = [...session.teamB];
  
    if (currentTeam === 'A') {
      const playerAIndex = newTeamA.indexOf(playerToSwap);
      const playerBIndex = newTeamB.indexOf(swapWithPlayer);
      if (playerAIndex !== -1 && playerBIndex !== -1) {
        newTeamA[playerAIndex] = swapWithPlayer;
        newTeamB[playerBIndex] = playerToSwap;
      }
    } else {
      const playerBIndex = newTeamB.indexOf(playerToSwap);
      const playerAIndex = newTeamA.indexOf(swapWithPlayer);
      if (playerBIndex !== -1 && playerAIndex !== -1) {
        newTeamB[playerBIndex] = swapWithPlayer;
        newTeamA[playerAIndex] = playerToSwap;
      }
    }
  
    await updateSession(session.id, { teamA: newTeamA, teamB: newTeamB });
    toast({ title: "Player Swapped", description: `${playerToSwap} and ${swapWithPlayer} have been swapped.` });
  };
  
  const enrollmentStatus = () => {
    if (isEnrolled) return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Signed Up</Badge>;
    if (isOnWaitlist) return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Waitlisted</Badge>;
    if (isFull) return <Badge variant="destructive">Full</Badge>;
    return <Badge variant="outline">Available</Badge>;
  };
  
  const renderTeam = (team: string[] | undefined, teamName: 'A' | 'B') => {
    if (!team) return null;
    const otherTeam = teamName === 'A' ? session.teamB : session.teamA;

    return (
      <div className="space-y-2">
        <h5 className="font-semibold">Team {teamName}</h5>
        <ul className="space-y-2">
          {team.map(player => (
            <li key={player} className="flex items-center justify-between text-sm">
              <span>{player}</span>
              {isAdmin && (
                <Select onValueChange={(swapWith) => handleSwapPlayer(player, teamName, swapWith)}>
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Swap with..." />
                  </SelectTrigger>
                  <SelectContent>
                    {otherTeam?.map(otherPlayer => (
                      <SelectItem key={otherPlayer} value={otherPlayer} className="text-xs">
                        {otherPlayer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>{session.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                    <MapPin className="h-4 w-4" /> {session.location}
                </CardDescription>
            </div>
            {isAdmin && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(session)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm font-normal text-destructive hover:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the session.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center text-sm mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(session.date), "EEEE, MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{session.time}</span>
            </div>
        </div>

        <Separator className="my-4" />
        
        {session.teamA && session.teamB ? (
             <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg flex items-center gap-2"><Users2 className="h-5 w-5"/> Teams</h4>
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleBackToPlayers}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleGenerateTeams}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                    </div>
                )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {renderTeam(session.teamA, 'A')}
                    {renderTeam(session.teamB, 'B')}
                </div>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5"/> Players</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{session.enrolledPlayers.length} / {session.capacity}</span>
                        {enrollmentStatus()}
                    </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                    {session.enrolledPlayers.length > 0 ? (
                        <p>{session.enrolledPlayers.join(', ')}</p>
                    ) : (
                        <p>No players signed up yet.</p>
                    )}
                </div>

                {session.waitlist.length > 0 && (
                    <div className="mt-4 text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">Waitlist:</p>
                        <p>{session.waitlist.join(', ')}</p>
                    </div>
                )}
                {isAdmin && session.enrolledPlayers.length >= 2 && !session.teamA && (
                    <Button className="w-full mt-4" onClick={handleGenerateTeams}>
                        <Users2 className="mr-2 h-4 w-4"/> Generate Teams
                    </Button>
                )}
            </>
        )}

      </CardContent>
      {!isPast && user && (
        <CardFooter>
            {isEnrolled || isOnWaitlist ? (
                <Button variant="destructive" className="w-full" onClick={handleUnenroll}>
                    <UserMinus className="mr-2 h-4 w-4"/> Withdraw
                </Button>
            ) : (
                <Button className="w-full" onClick={handleEnroll} disabled={isEnrolled || isOnWaitlist || (isFull && !isOnWaitlist)}>
                    <UserPlus className="mr-2 h-4 w-4"/>
                    {isFull ? "Join Waitlist" : "Sign up"}
                </Button>
            )}
        </CardFooter>
      )}
    </Card>
  );
}
