import { UserCircleIcon } from "lucide-react";
import type { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserInfo({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.image || undefined} />
        <AvatarFallback>
          <UserCircleIcon className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <span>{user.name}</span>
    </div>
  );
}
export default UserInfo;
