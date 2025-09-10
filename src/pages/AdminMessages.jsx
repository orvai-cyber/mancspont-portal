
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { Conversation, Message } from '@/api/entities';
import { User } from '@/api/entities';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import ConversationList from '../components/admin/messages/ConversationList';
import ChatWindow from '../components/admin/messages/ChatWindow';

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        let convs = [];
        if (currentUser.shelter_name) {
          convs = await Conversation.filter({ shelter_name: currentUser.shelter_name });
        } else if (currentUser.service_provider_id) {
          convs = await Conversation.filter({ service_provider_id: currentUser.service_provider_id });
        }
        setConversations(convs);
      } catch (error) {
        console.error("Hiba az adatok betöltésekor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };
  
  const handleUpdateConversation = useCallback(async (convId, updateData) => {
    try {
        await Conversation.update(convId, updateData);
        setConversations(prev =>
            prev.map(c => (c.id === convId ? { ...c, ...updateData } : c))
        );
        setSelectedConversation(prev => {
            if (prev && prev.id === convId) {
                return {...prev, ...updateData};
            }
            return prev;
        });
    } catch (error) {
        console.error("Hiba a beszélgetés frissítésekor:", error);
    }
  }, []);

  if (isLoading && !user) {
      return <AdminLayout><div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-12rem)] border bg-white rounded-lg overflow-hidden">
        {/* Left: Conversation List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Üzenetek</h2>
            <div className="relative mt-2">
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
            {isLoading ? (
                <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : (
                <ConversationList
                    conversations={conversations}
                    selectedConvId={selectedConversation?.id}
                    onSelect={handleSelectConversation}
                    searchTerm={searchTerm}
                />
            )}
          </div>
        </div>
        {/* Right: Chat Window */}
        <div className="w-2/3">
          <ChatWindow
            conversation={selectedConversation}
            currentUser={user}
            onUpdateConversation={handleUpdateConversation}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
