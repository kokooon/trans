import {Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"


const Settings = () => {
    return (
        <div>
            <Avatar className="h-50 w-50">
              <AvatarImage src="https://cdn.intra.42.fr/users/92731bef5d53f8af1ed11fd026274345/gmarzull.jpg" alt="@shadcn"/>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Settings;