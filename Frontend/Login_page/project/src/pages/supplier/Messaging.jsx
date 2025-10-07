import React, { useState, useEffect } from 'react';
import { Search, Send, Paperclip } from 'lucide-react';
import messageService from '../../services/messageService';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestedContacts, setSuggestedContacts] = useState([]);
  const [showSuggested, setShowSuggested] = useState(false);

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
      role: 'client',
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

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    loadMessages(conversation.other_user_id);
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
        setNewMessage('');
        loadMessages(selectedChat.other_user_id);
        loadConversations(currentUser.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {contact.first_name?.substring(0, 1).toUpperCase()}{contact.last_name?.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{contact.first_name} {contact.last_name}</h3>
                        <p className="text-xs text-gray-500">Client</p>
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
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.other_user_id}
                onClick={() => handleSelectChat(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                  selectedChat?.other_user_id === conversation.other_user_id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-green-600">
                      {conversation.other_user_name?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.other_user_name}</h3>
                      <span className="text-xs text-gray-500">{formatTime(conversation.last_message_time)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Client
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-green-600">
                      {selectedChat.other_user_name?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.other_user_name}</h2>
                    <p className="text-sm text-gray-500">Client</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === currentUser?.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === currentUser?.id ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
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