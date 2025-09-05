
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSessions } from "@/lib/hooks";
import type { Session, NewSession } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1." }),
});

interface AdminSessionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sessionToEdit?: Session | null;
}

export function AdminSessionDialog({ isOpen, setIsOpen, sessionToEdit }: AdminSessionDialogProps) {
  const { addSession, updateSession } = useSessions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      location: "",
      capacity: 12,
    },
  });
  
  React.useEffect(() => {
    if (isOpen) {
        form.reset({
            title: sessionToEdit?.title || "",
            date: sessionToEdit?.date ? format(new Date(sessionToEdit.date), "yyyy-MM-dd") : "",
            time: sessionToEdit?.time || "",
            location: sessionToEdit?.location || "",
            capacity: sessionToEdit?.capacity || 12,
        });
    }
  }, [sessionToEdit, form, isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const sessionData: NewSession = {
        title: values.title,
        date: new Date(values.date).toISOString().split('T')[0],
        time: values.time,
        location: values.location,
        capacity: values.capacity,
    };
    
    try {
        if (sessionToEdit) {
            await updateSession(sessionToEdit.id, sessionData);
            toast({ title: "Session Updated", description: "The session details have been changed." });
        } else {
            await addSession(sessionData);
            toast({ title: "Session Created", description: "The new session is now available." });
        }
        form.reset();
        setIsOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not save the session." });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{sessionToEdit ? "Edit Session" : "Create Session"}</DialogTitle>
          <DialogDescription>
            {sessionToEdit ? "Update the details for this session." : "Fill out the form to create a new session."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="capacity" render={({ field }) => (
                  <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (sessionToEdit ? "Save Changes" : "Create Session")}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
