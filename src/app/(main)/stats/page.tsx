
"use client";
import { useAuth } from "@/lib/hooks";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/PageHeader";

export default function StatsPage() {
    const { users } = useAuth();

    return (
        <>
            <PageHeader title="Player Statistics" />
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Player</TableHead>
                                <TableHead className="text-center">Matches</TableHead>
                                <TableHead className="text-center">Wins</TableHead>
                                <TableHead className="text-center">Losses</TableHead>
                                <TableHead className="text-center">Win Rate</TableHead>
                                <TableHead className="text-right">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => {
                                const stats = user.stats || { matchesPlayed: 0, wins: 0, losses: 0, pointsScored: 0 };
                                const winRate = stats.matchesPlayed > 0 ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) : 0;
                                return (
                                <TableRow key={user.username}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{stats.matchesPlayed}</TableCell>
                                    <TableCell className="text-center">{stats.wins}</TableCell>
                                    <TableCell className="text-center">{stats.losses}</TableCell>
                                    <TableCell className="text-center">{winRate}%</TableCell>
                                    <TableCell className="text-right">{stats.pointsScored}</TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
