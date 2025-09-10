import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { UploadFile } from '@/api/integrations';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function MessageInput({ conversation, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Sikertelen feltöltés",
        description: "Csak JPG, PNG, WEBP, HEIC és PDF fájlok tölthetők fel.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
        toast({
            variant: "destructive",
            title: "Túl nagy fájl",
            description: `A fájl mérete nem haladhatja meg a ${MAX_FILE_SIZE / 1024 / 1024}MB-ot.`,
        });
        return;
    }

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await sendMessage('', [file_url]);
    } catch (error) {
      console.error("Fájlfeltöltési hiba:", error);
      toast({ variant: "destructive", title: "Hiba történt a fájlfeltöltés során." });
    } finally {
      setIsUploading(false);
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message, []);
      setMessage('');
    }
  };

  const sendMessage = async (text, files) => {
    setIsSending(true);
    await onSendMessage(text, files);
    setIsSending(false);
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={conversation.blocked_by_shelter ? "Ez a felhasználó le van tiltva." : "Írj üzenetet..."}
          className="pr-24 pl-12"
          rows={2}
          disabled={isSending || isUploading || conversation.blocked_by_shelter}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="absolute left-3 top-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={ALLOWED_FILE_TYPES.join(',')}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current.click()}
            disabled={isSending || isUploading || conversation.blocked_by_shelter}
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
          </Button>
        </div>
        <div className="absolute right-3 top-3">
          <Button
            size="icon"
            onClick={handleSend}
            disabled={(!message.trim() && !isUploading) || isSending || conversation.blocked_by_shelter}
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Támogatott fájltípusok: jpg, png, webp, heic, pdf (max 5MB).</p>
    </div>
  );
}