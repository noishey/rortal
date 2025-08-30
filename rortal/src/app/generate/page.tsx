'use client';

import { useState } from 'react';
import { Send, Bot, User, Paperclip, ArrowUp } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function GeneratePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI art assistant. Describe the image you\'d like me to generate and I\'ll create it for you.',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'll generate an image based on: \"${userMessage.content}\". This feature is coming soon!`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Chat Container - Mobile Responsive */}
      <div className="flex-1 flex flex-col w-full h-screen">
        {/* Messages Area - Mobile Responsive */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 pt-4 md:pt-20">
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 md:space-x-3 mb-3 md:mb-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-2 border-[#4b871c] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4b871c]/50">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-lg p-2 md:p-3 ${
                    message.role === 'user'
                      ? 'bg-black border-2 border-purple-600 text-white ml-auto shadow-lg shadow-purple-600/50'
                      : 'bg-black text-white border-2 border-[#4b871c]/50'
                  }`}
                >
                  <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-2 border-[#4b871c] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4b871c]/50">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div className="bg-black text-white rounded-lg p-2 md:p-3 border-2 border-[#4b871c]/50">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#4b871c] rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Mobile Responsive with CSS Specifications */}
        <div className="p-3 md:p-4 pb-4 md:pb-6">
          <div className="max-w-4xl mx-auto w-full">
            {/* Input Container - Responsive Design */}
            <div 
              className="flex items-center bg-black border border-[#424242] rounded-2xl shadow-lg shadow-[#4b871c]/20 w-full"
              style={{
                boxSizing: 'border-box',
                padding: '12px 12px 12px 20px',
                gap: '16px',
                height: '56px',
                maxWidth: '768px',
                margin: '0 auto'
              }}
            >
              {/* Attach Button */}
              <button 
                className="flex-shrink-0 relative hover:scale-110 transition-transform"
                style={{
                  width: '24px',
                  height: '24px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                <Paperclip className="w-6 h-6 text-[#4b871c]" />
                {/* Vector 1 (Stroke) */}
                <div 
                  className="absolute bg-white"
                  style={{
                    left: '20.83%',
                    right: '20.83%',
                    top: '9.38%',
                    bottom: '9.38%'
                  }}
                />
              </button>
              
              {/* Input Field - Responsive */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe image/video/sound to generate"
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-[#9B9B9B] focus:placeholder-[#4b871c]/60"
                style={{
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 1
                }}
              />
              
              {/* Submit Button - Updated with CSS Specifications */}
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="flex items-center justify-center bg-[#383838] hover:bg-[#4b871c]/20 rounded-lg relative transition-colors shadow-lg shadow-[#4b871c]/30"
                style={{
                  width: '32px',
                  height: '32px',
                  padding: '8px',
                  gap: '8px',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0
                }}
              >
                {/* Arrow Up Icon */}
                <div 
                  className="relative"
                  style={{
                    width: '16px',
                    height: '16px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0
                  }}
                >
                  <ArrowUp className="w-4 h-4 text-white" />
                  {/* Vector */}
                  <div 
                    className="absolute bg-[#212121]"
                    style={{
                      left: '15.33%',
                      right: '15.33%',
                      top: '7.29%',
                      bottom: '8.33%'
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}