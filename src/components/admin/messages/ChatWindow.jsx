
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/api/entities';
import { User } from '@/api/entities';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, ShieldOff, Flag, FileText, Image as ImageIcon, Loader2, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import MessageInput from './MessageInput';

function MessageBubble({ msg, isMe, userAvatar, shelterAvatar }) {
  const isImage = (url) => /\.(jpg|jpeg|png|webp|heic)$/i.test(url);
  const isPdf = (url) => /\.pdf$/i.test(url);

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{msg.sender_name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${
          isMe
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
        {msg.file_urls && msg.file_urls.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.file_urls.map((url, i) => (
              <a href={url} target="_blank" rel="noopener noreferrer" key={i} className="block">
                {isImage(url) ? (
                  <img src={url} alt="csatolmány" className="rounded-lg max-w-xs max-h-64 object-cover" />
                ) : (
                  <div className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-blue-500' : 'bg-gray-100'}`}>
                    {isPdf(url) ? <FileText className="w-5 h-5"/> : <ImageIcon className="w-5 h-5"/>}
                    <span className="truncate text-sm">Csatolt fájl megnyitása</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
        <p className={`text-xs mt-2 ${isMe ? 'text-blue-200' : 'text-gray-500'} text-right`}>
          {format(new Date(msg.created_date), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}

export default function ChatWindow({ conversation, currentUser, onUpdateConversation }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      if (!conversation) return;
      setIsLoading(true);
      try {
        const msgs = await Message.filter({ conversation_id: conversation.id }, 'created_date');
        setMessages(msgs);
        
        // Mark messages as read for the recipient (service provider)
        if (conversation.recipient_unread_count > 0) {
            onUpdateConversation(conversation.id, { recipient_unread_count: 0 });
        }
      } catch (error) {
        console.error("Hiba a csevegés betöltésekor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [conversation, onUpdateConversation]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content, file_urls) => {
    if (!content.trim() && file_urls.length === 0) return;

    const newMessage = {
      conversation_id: conversation.id,
      sender_id: currentUser.id,
      sender_name: conversation.recipient_name, // The shelter/service provider's name
      content: content,
      file_urls: file_urls,
    };
    
    try {
        const createdMessage = await Message.create(newMessage);
        setMessages(prev => [...prev, createdMessage]);

        // Update conversation preview and increment user_unread_count
        const preview = content ? content.substring(0, 40) : 'Fájl elküldve';
        onUpdateConversation(conversation.id, {
            last_message_preview: preview,
            last_message_timestamp: new Date().toISOString(),
            user_unread_count: (conversation.user_unread_count || 0) + 1
        });
    } catch(error) {
        console.error('Hiba az üzenet küldésekor:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }
  
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <MessageSquare className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">Válassz egy beszélgetést</h3>
        <p>A bal oldali listából válassz egy üzenetváltást a megtekintéshez.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.user_avatar} />
            <AvatarFallback>{conversation.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{conversation.user_name}</h3>
            {/* Online status could be added here */}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onUpdateConversation(conversation.id, { blocked_by_recipient: !conversation.blocked_by_recipient })}
              className={conversation.blocked_by_recipient ? 'text-green-600' : 'text-red-600'}
            >
              <ShieldOff className="w-4 h-4 mr-2" />
              {conversation.blocked_by_recipient ? 'Tiltás feloldása' : 'Felhasználó tiltása'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateConversation(conversation.id, { is_reported: true })}>
              <Flag className="w-4 h-4 mr-2" />
              Felhasználó jelentése
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isMe={msg.sender_id !== conversation.user_id}
            userAvatar={conversation.user_avatar}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput 
        conversation={conversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
