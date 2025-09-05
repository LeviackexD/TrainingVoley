
"use client";

import { useMemo, useState } from "react";
import { isPast, parseISO, isToday } from "date-fns";
import { PlusCircle, Users } from "lucide-react";

import { useSessions, useAuth } from "@/lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SessionCard } from "./SessionCard";
import { AdminSessionDialog } from "./AdminSessionDialog";
import { UserListDialog } from "./UserListDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Session } from "@/lib/types";

export function SessionList() {
  const { sessions, isLoading } = useSessions();
  const { isAdmin } = useAuth();
  const [isAdminSessionDialogOpen, setIsAdminSessionDialogOpen] = useState(false);
  const [isUserListDialogOpen, setIsUserListDialogOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    });
  }, [sessions]);
  
  const upcomingSessions = useMemo(() => sortedSessions.filter(s => {
    const sessionDate = new Date(s.date);
    return !isPast(sessionDate) || isToday(sessionDate);
  }), [sortedSessions]);
  
  const pastSessions = useMemo(() => sortedSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return isPast(sessionDate) && !isToday(sessionDate);
  }), [sortedSessions]);

  const handleEdit = (session: Session) => {
    setSessionToEdit(session);
    setIsAdminSessionDialogOpen(true);
  }

  const handleAddNew = () => {
    setSessionToEdit(null);
    setIsAdminSessionDialogOpen(true);
  }

  const renderSessionList = (sessionList: Session[]) => {
    if (sessionList.length > 0) {
      return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sessionList.map((session) => (
            <SessionCard key={session.id} session={session} onEdit={handleEdit} />
          ))}
        </div>
      );
    }
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No sessions to display.</p>
      </div>
    );
  };

  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
        {isAdmin && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button onClick={handleAddNew} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Session
            </Button>
            <Button onClick={() => setIsUserListDialogOpen(true)} variant="outline" className="w-full md:w-auto">
              <Users className="mr-2 h-4 w-4" />
              View Users
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? renderSkeletons() : renderSessionList(upcomingSessions)}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
           {isLoading ? renderSkeletons() : renderSessionList(pastSessions)}
        </TabsContent>
      </Tabs>

      <AdminSessionDialog
        isOpen={isAdminSessionDialogOpen}
        setIsOpen={setIsAdminSessionDialogOpen}
        sessionToEdit={sessionToEdit}
      />
      {isAdmin && (
        <UserListDialog 
          isOpen={isUserListDialogOpen}
          setIsOpen={setIsUserListDialogOpen}
        />
      )}
    </>
  );
}
