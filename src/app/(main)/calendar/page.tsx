
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useSessions } from "@/lib/hooks";
import { useState } from "react";
import { parseISO } from "date-fns";
import { PageHeader } from "@/components/PageHeader";

export default function CalendarPage() {
    const { sessions } = useSessions();
    const [date, setDate] = useState<Date | undefined>(new Date())

    const events = sessions.map(s => parseISO(s.date));

    return (
        <>
            <PageHeader title="Events Calendar" />
            <Card>
                <CardContent className="flex justify-center pt-6">
                   <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        modifiers={{ events: events }}
                        modifiersStyles={{
                            events: {
                                color: 'hsl(var(--primary-foreground))',
                                backgroundColor: 'hsl(var(--primary))',
                            }
                        }}
                    />
                </CardContent>
            </Card>
        </>
    )
}
