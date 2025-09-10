
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { hu } from 'date-fns/locale';

export default function ConversationList({ conversations, selectedConvId, onSelect, searchTerm }) {

  const filteredConversations = conversations
    .filter(c => c.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp));

  return (
    <div className="flex flex-col h-full">
      {filteredConversations.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv)}
          className={`w-full text-left p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${selectedConvId === conv.id ? 'bg-blue-50' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={conv.user_avatar} />
              <AvatarFallback>{conv.user_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold truncate">{conv.user_name}</h3>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {conv.last_message_timestamp ? formatDistanceToNow(new Date(conv.last_message_timestamp), { addSuffix: true, locale: hu }) : ''}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-600 truncate pr-2">{conv.last_message_preview}</p>
                {conv.recipient_unread_count > 0 && (
                  <Badge className="bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                    {conv.recipient_unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
