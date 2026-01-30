import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Search, 
  Send, 
  User,
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  messages: Message[];
}

export function MessagesPage() {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Instructor - Web Development',
      lastMessage: 'Great work on your last assignment!',
      timestamp: '10:30 AM',
      unreadCount: 2,
      messages: [
        {
          id: 'm1',
          sender: 'Dr. Sarah Johnson',
          content: 'Hi John, I reviewed your assignment submission.',
          timestamp: '10:15 AM',
          isCurrentUser: false
        },
        {
          id: 'm2',
          sender: 'Dr. Sarah Johnson',
          content: 'Great work on your last assignment! Your implementation of the React hooks was excellent.',
          timestamp: '10:30 AM',
          isCurrentUser: false
        },
      ]
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      role: 'Instructor - Database Systems',
      lastMessage: 'The deadline has been extended to next Friday',
      timestamp: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm3',
          sender: 'You',
          content: 'Professor, will the project deadline be extended?',
          timestamp: 'Yesterday 2:00 PM',
          isCurrentUser: true
        },
        {
          id: 'm4',
          sender: 'Prof. Michael Chen',
          content: 'The deadline has been extended to next Friday',
          timestamp: 'Yesterday 3:15 PM',
          isCurrentUser: false
        },
      ]
    },
    {
      id: '3',
      name: 'Study Group - CS 301',
      role: 'Group Chat',
      lastMessage: 'Anyone free to meet tomorrow?',
      timestamp: '2 days ago',
      unreadCount: 5,
      messages: [
        {
          id: 'm5',
          sender: 'Emma Wilson',
          content: 'Hey everyone! Should we schedule a study session?',
          timestamp: '2 days ago',
          isCurrentUser: false
        },
        {
          id: 'm6',
          sender: 'You',
          content: 'I\'m available tomorrow afternoon',
          timestamp: '2 days ago',
          isCurrentUser: true
        },
        {
          id: 'm7',
          sender: 'James Brown',
          content: 'Anyone free to meet tomorrow?',
          timestamp: '2 days ago',
          isCurrentUser: false
        },
      ]
    },
    {
      id: '4',
      name: 'Admin Support',
      role: 'Academic Support',
      lastMessage: 'Your transcript request has been processed',
      timestamp: '1 week ago',
      unreadCount: 0,
      messages: [
        {
          id: 'm8',
          sender: 'You',
          content: 'I need to request my official transcript',
          timestamp: '1 week ago',
          isCurrentUser: true
        },
        {
          id: 'm9',
          sender: 'Admin Support',
          content: 'Your transcript request has been processed',
          timestamp: '1 week ago',
          isCurrentUser: false
        },
      ]
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-white flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Messages</h2>
            {totalUnread > 0 && (
              <Badge className="bg-[#dc2626] text-white">
                {totalUnread}
              </Badge>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-red-50 border-l-4 border-l-[#dc2626]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {conversation.role}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-[#dc2626] text-white h-5 min-w-[20px] flex items-center justify-center text-xs px-1.5">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedConversation.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isCurrentUser ? 'order-2' : 'order-1'}`}>
                      {!message.isCurrentUser && (
                        <p className="text-xs font-medium mb-1 ml-1">{message.sender}</p>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          message.isCurrentUser
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs text-muted-foreground mt-1 ${message.isCurrentUser ? 'text-right' : 'text-left'} ml-1`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[44px] max-h-32 resize-none pr-10"
                      rows={1}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 bottom-2"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send, Shift + Enter for new line
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
