
"use client";

import { useMemo } from "react";
import { isPast, parseISO, isToday } from "date-fns";
import { format } from "date-fns";
import { useSessions } from "@/lib/hooks";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";


export default function HistoryPage() {
    const { sessions } = useSessions();

    const pastSessions = useMemo(() => {
        return [...sessions]
            .filter(s => {
                const sessionDate = new Date(s.date);
                return (isPast(sessionDate) && !isToday(sessionDate)) && s.teamA && s.teamB;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [sessions]);

    return (
        <>
            <PageHeader title="Match History" description="Review of past matches and results." />
            <Card>
                <CardContent className="pt-6">
                    {pastSessions.length > 0 ? (
                         <Accordion type="single" collapsible className="w-full">
                            {pastSessions.map(session => (
                                <AccordionItem value={session.id} key={session.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-4">
                                            <div className="flex flex-col text-left">
                                                <span className="font-semibold">{session.title}</span>
                                                <span className="text-sm text-muted-foreground">{format(parseISO(session.date), "EEEE, MMM d, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center">
                                                {session.score ? (
                                                     <Badge>Team A {session.score.teamA} - {session.score.teamB} Team B</Badge>
                                                ) : (
                                                    <Badge variant="outline">No score reported</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                            <div>
                                                <h4 className="font-semibold mb-2">Team A</h4>
                                                <ul className="list-disc list-inside">
                                                    {session.teamA?.map(player => <li key={player}>{player}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Team B</h4>
                                                <ul className="list-disc list-inside">
                                                    {session.teamB?.map(player => <li key={player}>{player}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No match history to display.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
