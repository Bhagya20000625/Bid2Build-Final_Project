import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, Paperclip } from 'lucide-react';
import messageService from '../../services/messageService';
import { useSocket } from '../../hooks/useSocket';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestedContacts, setSuggestedContacts] = useState([]);
  const [showSuggested, setShowSuggested] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket.io event handlers
  const handleReceiveMessage = useCallback((message) => {
    // If message is from current conversation, add it to messages
    if (selectedChat && (message.sender_id === selectedChat.other_user_id || message.recipient_id === selectedChat.other_user_id)) {
      setMessages(prev => [...prev, message]);
      // Mark as read if conversation is open
      if (message.sender_id === selectedChat.other_user_id && currentUser) {
        messageService.markConversationAsRead(currentUser.id, selectedChat.other_user_id);
      }
    }
    // Refresh conversations list
    if (currentUser) {
      loadConversations(currentUser.id);
    }
  }, [selectedChat, currentUser]);

  const handleMessageRead = useCallback((data) => {
    // Update message read status in UI
    setMessages(prev => prev.map(msg =>
      msg.id === data.messageId ? { ...msg, is_read: true } : msg
    ));
  }, []);

  const handleTyping = useCallback((data) => {
    if (selectedChat && data.isTyping) {
      setIsTyping(true);
      setTypingUser(data.senderName);
      // Clear typing indicator after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingUser('');
      }, 3000);
    } else {
      setIsTyping(false);
      setTypingUser('');
    }
  }, [selectedChat]);

  // Initialize Socket.io
  const { sendMessage: sendSocketMessage, sendTypingIndicator, markAsRead } = useSocket(
    currentUser?.id,
    handleReceiveMessage,
    handleMessageRead,
    handleTyping
  );

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      loadConversations(user.id);
      loadSuggestedContacts(user.id);
    }
  }, []);

  const loadSuggestedContacts = async (userId) => {
    try {
      const response = await messageService.getSuggestedContacts(userId);
      if (response.success) {
        setSuggestedContacts(response.contacts || []);
      }
    } catch (error) {
      console.error('Failed to load suggested contacts:', error);
    }
  };

  const startConversationWithContact = (contact) => {
    const newConversation = {
      other_user_id: contact.contact_id,
      other_user_name: `${contact.first_name} ${contact.last_name}`,
      role: contact.contact_role,
      last_message: '',
      last_message_time: new Date().toISOString(),
      unread_count: 0
    };
    setSelectedChat(newConversation);
    setMessages([]);
    setShowSuggested(false);
  };

  const loadConversations = async (userId) => {
    try {
      setLoading(true);
      const response = await messageService.getUserConversations(userId);
      if (response.success) {
        setConversations(response.conversations || response.data || []);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    if (!currentUser) return;

    try {
      const response = await messageService.getConversation(currentUser.id, otherUserId);
      if (response.success) {
        setMessages(response.messages || response.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const handleSelectChat = async (conversation) => {
    setSelectedChat(conversation);
    loadMessages(conversation.other_user_id);
    // Mark messages as read when opening conversation
    if (currentUser && conversation.unread_count > 0) {
      try {
        await messageService.markConversationAsRead(currentUser.id, conversation.other_user_id);
        // Refresh conversations to update unread count
        loadConversations(currentUser.id);
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    try {
      const messageData = {
        sender_id: currentUser.id,
        recipient_id: selectedChat.other_user_id,
        message: newMessage.trim()
      };

      const response = await messageService.sendMessage(messageData);

      if (response.success) {
        // Send via Socket.io for real-time delivery
        sendSocketMessage(selectedChat.other_user_id, response.messageData);

        setNewMessage('');
        loadMessages(selectedChat.other_user_id);
        loadConversations(currentUser.id);

        // Stop typing indicator
        sendTypingIndicator(selectedChat.other_user_id, false, `${currentUser.first_name} ${currentUser.last_name}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleMessageInputChange = (e) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (selectedChat && currentUser) {
      sendTypingIndicator(
        selectedChat.other_user_id,
        e.target.value.length > 0,
        `${currentUser.first_name} ${currentUser.last_name}`
      );
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const selectedConversation = selectedChat;

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Suggested Contacts Section */}
        {suggestedContacts.length > 0 && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => setShowSuggested(!showSuggested)}
              className="w-full p-4 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>Suggested Contacts ({suggestedContacts.length})</span>
              <span>{showSuggested ? '▼' : '▶'}</span>
            </button>
            {showSuggested && (
              <div className="max-h-48 overflow-y-auto">
                {suggestedContacts.map((contact) => (
                  <button
                    key={contact.contact_id}
                    onClick={() => startConversationWithContact(contact)}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        contact.contact_role === 'constructor' ? 'bg-blue-600' :
                        contact.contact_role === 'architect' ? 'bg-purple-600' : 'bg-green-600'
                      }`}>
                        {contact.first_name?.substring(0, 1).toUpperCase()}{contact.last_name?.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{contact.first_name} {contact.last_name}</h3>
                        <p className="text-xs text-gray-500">{contact.contact_role?.charAt(0).toUpperCase() + contact.contact_role?.slice(1)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.other_user_id}
                onClick={() => handleSelectChat(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                  selectedChat?.other_user_id === conversation.other_user_id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                      conversation.role === 'constructor' ? 'bg-blue-600' :
                      conversation.role === 'architect' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {conversation.other_user_name?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.other_user_name}</h3>
                      <span className="text-xs text-gray-500">{formatTimestamp(conversation.last_message_time)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      conversation.role === 'constructor' ? 'bg-blue-100 text-blue-800' :
                      conversation.role === 'architect' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {conversation.role?.charAt(0).toUpperCase() + conversation.role?.slice(1)}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedConversation.role === 'constructor' ? 'bg-blue-600' :
                      selectedConversation.role === 'architect' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {selectedConversation.other_user_name?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.other_user_name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.role?.charAt(0).toUpperCase() + selectedConversation.role?.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === currentUser?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                          {message.sender_id === currentUser?.id && message.is_read && (
                            <span className="text-xs text-blue-100 ml-2">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm italic text-gray-500">{typingUser} is typing...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleMessageInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;