"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlayerRole } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const { user, getUserByUsername } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fullUser = user ? getUserByUsername(user.username) : null;

  if (!fullUser) {
    return <div>Loading...</div>;
  }

  const stats = fullUser.stats || { matchesPlayed: 0, wins: 0, losses: 0, pointsScored: 0 };
  const winRate = stats.matchesPlayed > 0 ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) : "0";

  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const formatRole = (role: PlayerRole) => {
    return role.replace(/_/g, ' ').split(' ').map(capitalize).join(' ');
  }

  return (
    <>
      <PageHeader title="My Profile" />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={fullUser.avatarUrl} alt={fullUser.username} />
                  <AvatarFallback className="text-3xl">
                    {fullUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl">{fullUser.username}</CardTitle>
                  <CardDescription className="flex items-center flex-wrap gap-2 pt-2">
                    {fullUser.skillLevel && <Badge variant="outline">{capitalize(fullUser.skillLevel)}</Badge>}
                    {fullUser.role && <Badge variant="secondary">{formatRole(fullUser.role)}</Badge>}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="h-4 w-4"/>
                <span className="sr-only">Edit Profile</span>
              </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <h3 className="text-xl font-semibold mb-4">Player Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Matches Played</p>
              <p className="text-2xl font-bold">{stats.matchesPlayed}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">{winRate}%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Wins</p>
              <p className="text-2xl font-bold">{stats.wins}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{stats.pointsScored}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <EditProfileDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        user={fullUser}
      />
    </>
  );
}
