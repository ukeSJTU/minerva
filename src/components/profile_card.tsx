import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, MailIcon, RssIcon } from "lucide-react";

interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  motto: string;
  yearsWriting: number;
  followers: number;
  posts: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  motto,
  yearsWriting,
  followers,
  posts,
}) => {
  return (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-bold">{name}</h2>
        <p className="text-sm text-gray-500">{motto}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around text-sm text-gray-500">
          {/* TODO: need to add clickable links to following contents. Example: click on followers to see all followers */}
          <div className="flex flex-col justify-between items-center">
            <span>{yearsWriting}</span>
            <span>years</span>
          </div>
          <div className="flex flex-col justify-between items-center">
            <span>{followers}</span>
            <span>followers</span>
          </div>
          <div className="flex flex-col justify-between items-center">
            <span>{posts}</span>
            <span>posts</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button className="w-full mb-4">Subscribe</Button>
        <div className="flex space-x-4">
          {/* TODO: need to add clickable external links to following icons. Example: click on github icon and jump to github profile/repo page */}
          <GithubIcon className="w-5 h-5" />
          {/* TODO: This GithubIcon will be deprecated */}
          <MailIcon className="w-5 h-5" />
          <RssIcon className="w-5 h-5" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
