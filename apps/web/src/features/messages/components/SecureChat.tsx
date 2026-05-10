import React, { useState } from 'react';
import { useMessages } from '../stores/useMessages';

export default function SecureChat({ recipient }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useMessages();

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input, recipient.id, recipient.public_key);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-bold">{recipient.username}</h2>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded uppercase tracking-widest border border-emerald-500/20">
          E2E Encrypted
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-xs ${msg.senderId === 'me' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
              {/* Note: Logic to decrypt 'msg.ciphertext' would be called here */}
              {msg.ciphertext.substring(0, 15)}... (Encrypted)
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2"
            placeholder="Type a secure message..."
          />
          <button onClick={handleSend} className="bg-indigo-600 px-4 py-2 rounded-lg font-bold">Send</button>
        </div>
      </div>
    </div>
  );
}