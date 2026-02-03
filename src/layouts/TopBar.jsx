import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, User, Menu } from 'lucide-react';

const TopBar = ({ userName, onProfile, onNotifications, onMessages }) => {
    return (
        <header className="h-16 bg-white border-b px-4 md:px-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
                <h2 className="text-sm md:text-lg font-semibold truncate">
                  Welcome, {userName || 'User'}
                </h2>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={onMessages}>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onNotifications}>
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="h-8 w-px bg-border mx-1" />
                <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 pl-2"
                    onClick={onProfile}
                >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">Profile</span>
                </Button>
            </div>
        </header>
    );
};

export default TopBar;
