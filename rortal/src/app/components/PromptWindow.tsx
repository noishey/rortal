'use client'; // Enable client-side rendering for this component

// Import React hooks for state management and side effects
import { useState, useRef, useEffect } from 'react';
// Import Lucide React icons for UI elements
import { X, Send, User, Bot } from 'lucide-react';

// TypeScript interface defining the structure of a chat message
interface Message {
  id: string; // Unique identifier for each message
  content: string; // The actual text content of the message
  role: 'user' | 'assistant'; // Indicates whether message is from user or AI assistant
  timestamp: Date; // When the message was created
}

// TypeScript interface defining props for the PromptWindow component
interface PromptWindowProps {
  isOpen: boolean; // Controls whether the modal is visible
  onClose: () => void; // Callback function to close the modal
  onGenerate?: (prompt: string) => void; // Optional callback to generate AI art with the prompt
}

// Main PromptWindow component - ChatGPT-like interface for AI art creation
export default function PromptWindow({ isOpen, onClose, onGenerate }: PromptWindowProps) {
  // State to store all chat messages, initialized with a welcome message from the assistant
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1', // Static ID for the initial message
      content: 'Hello! I\'m here to help you create amazing AI-generated NFTs. Describe what you\'d like to create and I\'ll help you craft the perfect prompt.', // Welcome message text
      role: 'assistant', // Message is from the AI assistant
      timestamp: new Date() // Current timestamp when component initializes
    }
  ]);
  const [inputValue, setInputValue] = useState(''); // State for the current input text
  const [isTyping, setIsTyping] = useState(false); // State to show typing indicator when AI is "thinking"
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to bottom of messages
  const inputRef = useRef<HTMLTextAreaElement>(null); // Ref to focus the input field

  // Function to automatically scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the bottom element
  };

  // Effect to scroll to bottom whenever messages array changes
  useEffect(() => {
    scrollToBottom(); // Call scroll function
  }, [messages]); // Dependency array - runs when messages change

  // Effect to focus the input field when the modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) { // Check if modal is open and input ref exists
      inputRef.current.focus(); // Focus the textarea for immediate typing
    }
  }, [isOpen]); // Dependency array - runs when isOpen changes

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return; // Exit early if input is empty or only whitespace

    // Create a new user message object
    const userMessage: Message = {
      id: Date.now().toString(), // Use timestamp as unique ID
      content: inputValue, // Use current input value as message content
      role: 'user', // Mark as user message
      timestamp: new Date() // Current timestamp
    };

    setMessages(prev => [...prev, userMessage]); // Add user message to messages array
    setInputValue(''); // Clear the input field
    setIsTyping(true); // Show typing indicator

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      // Create AI assistant response message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(), // Unique ID (timestamp + 1 to avoid collision)
        content: `Great idea! Based on your description "${userMessage.content}", I suggest this optimized prompt: "${userMessage.content}, digital art, highly detailed, vibrant colors, professional quality, trending on artstation". Would you like me to generate this image?`, // AI response with prompt enhancement
        role: 'assistant', // Mark as assistant message
        timestamp: new Date() // Current timestamp
      };
      setMessages(prev => [...prev, assistantMessage]); // Add assistant message to array
      setIsTyping(false); // Hide typing indicator
    }, 1500); // 1.5 second delay to simulate AI thinking time
  };

  // Function to handle keyboard shortcuts in the input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // If Enter is pressed without Shift
      e.preventDefault(); // Prevent default newline behavior
      handleSendMessage(); // Send the message instead
    }
    // Shift+Enter will still create a new line (default behavior)
  };

  // Function to handle generating AI art with a specific prompt
  const handleGenerate = (prompt: string) => {
    if (onGenerate) { // Check if onGenerate callback is provided
      onGenerate(prompt); // Call the callback with the prompt
    }
    onClose(); // Close the modal after generating
  };

  if (!isOpen) return null; // Don't render anything if modal is closed

  return (
    // Modal overlay covering the entire screen
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Main modal container with ChatGPT-like styling and custom positioning */}
      <div 
        className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        style={{
          position: 'absolute',
          left: '19.63%',
          right: '76.34%', 
          top: '5.11%',
          bottom: '94.59%',
          filter: 'drop-shadow(0px 2.17545px 5.43863px rgba(0, 0, 0, 0.1))'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {/* Left side - AI assistant info */}
          <div className="flex items-center space-x-3">
            {/* AI avatar with gradient background */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" /> {/* Bot icon */}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Art Creator</h2> {/* Modal title */}
              <p className="text-sm text-muted-foreground">Let's create something amazing together</p> {/* Subtitle */}
            </div>
          </div>
          {/* Right side - Close button */}
          <button
            onClick={onClose} // Call onClose when clicked
            className="p-2 hover:bg-secondary rounded-full transition-colors" // Hover effect styling
          >
            <X className="w-5 h-5 text-muted-foreground" /> {/* X icon for closing */}
          </button>
        </div>

        {/* Messages container - scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Map through all messages and render each one */}
          {messages.map((message) => (
            <div
              key={message.id} // Use message ID as React key
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : '' // Reverse layout for user messages
              }`}
            >
              {/* Avatar for each message */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-500' // Blue background for user
                  : 'bg-gradient-to-r from-purple-500 to-pink-500' // Gradient for assistant
              }`}>
                {/* Show appropriate icon based on message role */}
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" /> // User icon
                ) : (
                  <Bot className="w-4 h-4 text-white" /> // Bot icon
                )}
              </div>
              {/* Message content container */}
              <div className={`max-w-[70%] ${
                message.role === 'user' ? 'text-right' : 'text-left' // Align text based on role
              }`}>
                {/* Message bubble */}
                <div className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white' // Blue bubble for user messages
                    : 'bg-gray-100 text-gray-900' // Gray bubble for assistant messages
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p> {/* Message text with preserved whitespace */}
                </div>
                {/* Timestamp below message */}
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Format time as HH:MM */}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator - shown when AI is "thinking" */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              {/* AI avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" /> {/* Bot icon */}
              </div>
              {/* Typing animation */}
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  {/* Three bouncing dots to indicate typing */}
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div> {/* First dot */}
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div> {/* Second dot with delay */}
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div> {/* Third dot with more delay */}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
        </div>

        {/* Input section at bottom of modal */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            {/* Text input area */}
            <div className="flex-1">
              <textarea
                ref={inputRef} // Reference for focusing
                value={inputValue} // Controlled input value
                onChange={(e) => setInputValue(e.target.value)} // Update state on change
                onKeyPress={handleKeyPress} // Handle keyboard shortcuts
                placeholder="Describe the art you want to create..." // Placeholder text
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Styling with focus states
                rows={1} // Start with single row
                style={{ minHeight: '40px', maxHeight: '120px' }} // Height constraints
              />
            </div>
            {/* Send button */}
            <button
              onClick={handleSendMessage} // Send message when clicked
              disabled={!inputValue.trim() || isTyping} // Disable if no input or AI is typing
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors flex-shrink-0" // Button styling with disabled state
            >
              <Send className="w-5 h-5" /> {/* Send icon */}
            </button>
          </div>
          {/* Helper text and character counter */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span> {/* Keyboard shortcut help */}
            <span>{inputValue.length}/500</span> {/* Character counter (500 char limit) */}
          </div>
        </div>
      </div>
    </div>
  );
}