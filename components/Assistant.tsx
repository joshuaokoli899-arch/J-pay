import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm J pay, your financial assistant. How can I help you save or manage your money better today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getFinancialAdvice(input);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: "Sorry, something went wrong." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">AI Assistant</h1>
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-green-800 text-gray-900 dark:text-white rounded-bl-none'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-green-800 text-gray-900 dark:text-white rounded-bl-none flex items-center space-x-2`}>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-50 dark:bg-green-950">
        <div className="flex items-center bg-white dark:bg-green-900 rounded-full p-2 border border-gray-200 dark:border-green-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a financial question..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white px-3 focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-green-500 rounded-full p-2 hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;