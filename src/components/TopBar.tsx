import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Bell, MessageSquare, User } from "lucide-react";
import { Badge } from "./ui/badge";
import logoImage from "figma:asset/e43b99fbf3daf7ef0b4379bee2be48bce749b881.png";

interface TopBarProps {
  userName: string;
  userRole: 'student' | 'teacher' | 'admin';
  onProfile: () => void;
  onNotifications: () => void;
  onMessages: () => void;
}

export function TopBar({ userName, userRole, onProfile, onNotifications, onMessages }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-16 bg-[#1f2937] border-b border-[#374151] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img src={logoImage} alt="Nexora Logo" className="w-9 h-9 object-contain" />
          <h2 className="text-white text-xl font-bold tracking-tight">Nexora</h2>
        </div>
        
        {/* Search */}
        <div className="relative w-64 lg:w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#374151] border-[#4b5563] text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#374151] relative"
          onClick={onNotifications}
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#dc2626] text-white text-xs">
            3
          </Badge>
        </Button>

        {/* Messages */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#374151] relative"
          onClick={onMessages}
        >
          <MessageSquare className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#dc2626] text-white text-xs">
            5
          </Badge>
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#374151]"
          onClick={onProfile}
        >
          <div className="w-8 h-8 rounded-full bg-[#dc2626] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </Button>
      </div>
    </div>
  );
}