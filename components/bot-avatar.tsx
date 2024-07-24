import { Avatar, AvatarImage } from "@/components/ui/avatar";

 export const BotAvatar = ()=> {
    return(
        <Avatar className="h-8 w-8">
            <AvatarImage src="/bot.png" alt="bot" className="p-1" />
        </Avatar>
    )
 };