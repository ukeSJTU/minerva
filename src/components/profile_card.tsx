import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";
import { Card } from "./ui/card";

const ProfileCard = () => {
  return (
    <Card className="flex flex-col md:flex-row items-center bg-card text-card-foreground shadow-sm rounded-xl overflow-hidden w-full max-w-[800px]">
      <Avatar>
        <AvatarImage src="/images/avatar.jpg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </Card>
  );
};

export default ProfileCard;
