import React, { useState, useEffect } from 'react';
import { Conversation, Message } from '@/api/entities';
import { User } from '@/api/entities';
import UserLayout from '../components/user/UserLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MessageSquare, Send, Paperclip, AlertCircle, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function UserMessagesPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const userConversations = await Conversation.filter({ user_id: currentUser.id }, '-last_message_timestamp');
        setConversations(userConversations);
      } catch (error) {
        console.error('Hiba az üzenetek betöltésekor:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const loadMessages = async (conversation) => {
    try {
      const conversationMessages = await Message.filter({ conversation_id: conversation.id }, 'created_date');
      setMessages(conversationMessages);
      setSelectedConversation(conversation);
      
      // Mark as read
      if (conversation.user_unread_count > 0) {
        await Conversation.update(conversation.id, { user_unread_count: 0 });
        setConversations(prev =>
          prev.map(c => (c.id === conversation.id ? { ...c, user_unread_count: 0 } : c))
        );
      }
    } catch (error) {
      console.error('Hiba az üzenetek betöltésekor:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        sender_name: user.full_name,
        content: newMessage
      };

      await Message.create(messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

      // Update conversation
      await Conversation.update(selectedConversation.id, {
        last_message_preview: newMessage.substring(0, 100),
        last_message_timestamp: new Date().toISOString(),
        shelter_unread_count: (selectedConversation.shelter_unread_count || 0) + 1
      });
    } catch (error) {
      console.error('Hiba az üzenet küldésekor:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.shelter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <UserLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex h-[600px] border bg-white rounded-lg overflow-hidden">
            <div className="w-1/3 border-r">
              <div className="p-4 border-b">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2 p-2">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
            <div className="w-2/3">
              <Skeleton className="h-full" />
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Üzeneteim</h1>
            <p className="text-gray-600 mt-2">Beszélgetések menhelyekkel</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">{conversations.length} beszélgetés</span>
          </div>
        </div>

        <div className="flex h-[600px] border bg-white rounded-lg overflow-hidden">
          {/* Left: Conversation List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Keresés..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-green-50 border-r-2 border-r-green-500' : ''
                    }`}
                    onClick={() => loadMessages(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${conversation.shelter_name}`} />
                        <AvatarFallback>{conversation.shelter_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.shelter_name}
                          </h3>
                          {conversation.user_unread_count > 0 && (
                            <Badge className="bg-green-500 text-white text-xs min-w-[20px]">
                              {conversation.user_unread_count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message_preview}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.last_message_timestamp 
                            ? format(new Date(conversation.last_message_timestamp), 'MMM dd, HH:mm', { locale: hu })
                            : ''
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nincs beszélgetés</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Chat Window */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${selectedConversation.shelter_name}`} />
                      <AvatarFallback>{selectedConversation.shelter_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversation.shelter_name}</h2>
                      <p className="text-sm text-gray-600">Menhely</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isFromUser = message.sender_id === user?.id;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isFromUser 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isFromUser ? 'text-green-100' : 'text-gray-500'}`}>
                            {message.created_date 
                              ? format(new Date(message.created_date), 'HH:mm', { locale: hu })
                              : 'Most'
                            }
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Írj üzenetet..."
                      className="flex-grow"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">Válassz egy beszélgetést</h3>
                <p>A bal oldali listából válassz egy üzenetváltást a megtekintéshez.</p>
              </div>
            )}
          </div>
        </div>

        {conversations.length === 0 && (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Még nincsenek üzeneteid</h3>
            <p className="text-gray-600">
              Írj menhelyeknek és kezdj beszélgetéseket az örökbefogadásról!
            </p>
          </Card>
        )}
      </motion.div>
    </UserLayout>
  );
}