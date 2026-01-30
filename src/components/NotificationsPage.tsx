import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  Award,
  Clock,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: 'assignment' | 'grade' | 'message' | 'announcement' | 'achievement';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      title: 'New Assignment Posted',
      description: 'Introduction to React Hooks - Due in 3 days',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'grade',
      title: 'Grade Posted',
      description: 'Your grade for "Advanced JavaScript" quiz is now available',
      time: '1 hour ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message from Dr. Smith',
      description: 'Regarding your final project submission',
      time: '2 hours ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: '4',
      type: 'announcement',
      title: 'Course Update',
      description: 'Web Development 101 - Class schedule changed for next week',
      time: '1 day ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: 'You earned "Perfect Attendance" badge',
      time: '2 days ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '6',
      type: 'assignment',
      title: 'Assignment Due Soon',
      description: 'Database Design Project - Due tomorrow',
      time: '3 days ago',
      isRead: true,
      priority: 'high'
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
      case 'grade':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'announcement':
        return <AlertCircle className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-600';
      case 'grade':
        return 'bg-green-100 text-green-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      case 'announcement':
        return 'bg-orange-100 text-orange-600';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.isRead);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-1 bg-[#dc2626] text-white">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-muted-foreground text-center">
                  {activeTab === 'unread' 
                    ? 'No unread notifications' 
                    : 'No notifications'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-[#dc2626] bg-red-50/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className={`${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#dc2626] rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-[#dc2626]"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </div>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-[#dc2626] hover:text-[#b91c1c] hover:bg-red-50"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
