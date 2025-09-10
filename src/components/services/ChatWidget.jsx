
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Conversation, Message } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Send, 
  Loader2,
  User as UserIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ChatWidget({ serviceProvider, onClose, autoOpen = true }) {
  const [isOpen, setIsOpen] = useState(autoOpen); // Alapértelmezetten nyitott
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadConversation = useCallback(async (currentUser) => {
    if (!currentUser || !serviceProvider) return;
    
    setIsLoading(true);
    try {
      // Keresés meglévő beszélgetésre
      const existingConvs = await Conversation.filter({
        user_id: currentUser.id,
        service_provider_id: serviceProvider.id,
      });

      if (existingConvs.length > 0) {
        setConversation(existingConvs[0]);
      }
    } catch (error) {
      console.error('Hiba a beszélgetés betöltésekor:', error);
    } finally {
      setIsLoading(false);
    }
  }, [serviceProvider]);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      await loadConversation(currentUser);
    } catch (error) {
      console.error('Hiba a felhasználó betöltésekor:', error);
    }
  }, [loadConversation]);

  const loadMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      const conversationMessages = await Message.filter(
        { conversation_id: conversation.id }, 
        'created_date'
      );
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Hiba az üzenetek betöltésekor:', error);
    }
  }, [conversation]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('A kapcsolatfelvételhez kérjük, jelentkezz be!');
      User.loginWithRedirect(window.location.href);
      return;
    }

    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      let conv = conversation;
      
      // Ha nincs beszélgetés, létrehozunk egyet
      if (!conv) {
        conv = await Conversation.create({
          user_id: user.id,
          user_name: user.full_name,
          user_avatar: user.avatar_url,
          service_provider_id: serviceProvider.id,
          recipient_name: serviceProvider.name,
          last_message_timestamp: new Date().toISOString(),
          last_message_preview: newMessage.substring(0, 40),
          recipient_unread_count: 1,
          user_unread_count: 0
        });
        setConversation(conv);
      }

      // Üzenet létrehozása
      const messageData = {
        conversation_id: conv.id,
        sender_id: user.id,
        sender_name: user.full_name,
        content: newMessage,
      };

      const createdMessage = await Message.create(messageData);
      setMessages(prev => [...prev, createdMessage]);

      // Beszélgetés frissítése
      await Conversation.update(conv.id, {
        last_message_preview: newMessage.substring(0, 40),
        last_message_timestamp: new Date().toISOString(),
        recipient_unread_count: (conv.recipient_unread_count || 0) + 1,
      });

      setNewMessage('');
      toast.success('Üzenet elküldve!');
    } catch (error) {
      console.error('Hiba az üzenetküldéskor:', error);
      toast.error('Hiba történt az üzenet küldésekor.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    if (onClose) onClose();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* Chat Widget Button - csak akkor jelenjen meg, ha zárva van */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50" // Jobb alsó sarok
        >
          <Button
            onClick={handleOpen}
            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden" // Jobb alsó sarok
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={serviceProvider.main_photo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${serviceProvider.name}`} 
                  />
                  <AvatarFallback>
                    {serviceProvider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{serviceProvider.name}</h3>
                  <p className="text-xs text-blue-100">
                    {isLoading ? 'Betöltés...' : 'Aktív'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleMinimize}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white hover:bg-blue-500"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white hover:bg-blue-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="h-80 p-4 overflow-y-auto bg-gray-50">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Üdvözlő üzenet */}
                      {messages.length === 0 && (
                        <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-l-blue-600">
                          <div className="flex items-start gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage 
                                src={serviceProvider.main_photo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${serviceProvider.name}`} 
                              />
                              <AvatarFallback className="text-xs">
                                {serviceProvider.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm text-gray-800">
                                Szia! Kérdésed van a szolgáltatásaimmal kapcsolatban? Írj nekünk!
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {serviceProvider.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Üzenetek */}
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
                            <div className={`flex items-end gap-2 max-w-xs ${isFromUser ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Avatar className="w-6 h-6">
                                {isFromUser ? (
                                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                                    {user?.full_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                ) : (
                                  <>
                                    <AvatarImage 
                                      src={serviceProvider.main_photo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${serviceProvider.name}`} 
                                    />
                                    <AvatarFallback className="text-xs">
                                      {serviceProvider.name.charAt(0)}
                                    </AvatarFallback>
                                  </>
                                )}
                              </Avatar>
                              <div className={`px-3 py-2 rounded-lg text-sm ${
                                isFromUser 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white text-gray-800 border'
                              }`}>
                                <p>{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  isFromUser ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {message.created_date 
                                    ? new Date(message.created_date).toLocaleTimeString('hu-HU', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })
                                    : 'Most'
                                  }
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Írj üzenetet..."
                      className="flex-1 text-sm"
                      disabled={isSending}
                      autoFocus // Automatikus fókusz az input mezőre
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!newMessage.trim() || isSending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                  {!user && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      A kapcsolatfelvételhez jelentkezz be
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsMinimized(false)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage 
                      src={serviceProvider.main_photo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${serviceProvider.name}`} 
                    />
                    <AvatarFallback>
                      {serviceProvider.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-800">
                      {serviceProvider.name}
                    </h3>
                    <p className="text-xs text-gray-500">Kattints a megnyitáshoz</p>
                  </div>
                  {messages.length > 0 && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {messages.length}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
