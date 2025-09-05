
"use client";

import { useAuth } from "@/lib/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserListDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function UserListDialog({ isOpen, setIsOpen }: UserListDialogProps) {
  const { users, adminUsernames } = useAuth();
  
  const filteredUsers = users.filter(user => !adminUsernames.includes(user.username));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registered Users</DialogTitle>
          <DialogDescription>
            A list of all non-admin users registered in the application.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          <div className="space-y-4 pr-6">
            {filteredUsers.map((user) => (
              <div key={user.username} className="flex items-center gap-4">
                <Avatar key={user.username}>
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
