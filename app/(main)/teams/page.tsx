
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { PageHeader } from "@/components/PageHeader";

const TEAMS: Team[] = [
    { id: uuidv4(), name: "Eagles A", players: ["Manu", "player1", "player2"], captain: "Manu" },
    { id: uuidv4(), name: "Eagles B", players: ["player3", "player4", "player5"], captain: "player3" },
];

export default function TeamsPage() {
    return (
        <>
            <PageHeader title="Teams" />
            <Card>
                <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team Name</TableHead>
                            <TableHead>Captain</TableHead>
                            <TableHead>Players</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {TEAMS.map(team => (
                            <TableRow key={team.id}>
                                <TableCell className="font-medium">{team.name}</TableCell>
                                <TableCell>{team.captain}</TableCell>
                                <TableCell>{team.players.join(', ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </>
    )
}
