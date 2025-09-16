import React, { useState } from 'react';
import { MessageCircle, Search, Send, Paperclip, MoreVertical } from 'lucide-react';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const conversations = [
    {
      id: 1,
      clientName: 'Johnson Construction',
      avatar: 'JC',
      lastMessage: 'Thank you for the quick delivery of steel beams!',
      timestamp: '2024-01-23T10:30:00Z',
      unreadCount: 0,
      status: 'online',
      projectTitle: 'Steel Beams for Framework'
    },
    {
      id: 2,
      clientName: 'ABC Builders',
      avatar: 'AB',
      lastMessage: 'When can you deliver the concrete mix?',
      timestamp: '2024-01-23T09:15:00Z',
      unreadCount: 2,
      status: 'offline',
      projectTitle: 'Concrete Mix & Delivery'
    },
    {
      id: 3,
      clientName: 'Metro Projects',
      avatar: 'MP',
      lastMessage: 'Could you provide a revised quotation?',
      timestamp: '2024-01-22T16:45:00Z',
      unreadCount: 1,
      status: 'online',
      projectTitle: 'Electrical Wiring Supplies'
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        senderId: 'client',
        senderName: 'Johnson Construction',
        content: 'Hi, I received your quotation for the steel beams. The pricing looks good.',
        timestamp: '2024-01-23T09:00:00Z',
        type: 'text'
      },
      {
        id: 2,
        senderId: 'supplier',
        senderName: 'You',
        content: 'Thank you! I can guarantee the quality and timely delivery. When do you need them delivered?',
        timestamp: '2024-01-23T09:05:00Z',
        type: 'text'
      },
      {
        id: 3,
        senderId: 'client',
        senderName: 'Johnson Construction',
        content: 'We need them by next Friday. Can you make that deadline?',
        timestamp: '2024-01-23T09:10:00Z',
        type: 'text'
      },
      {
        id: 4,
        senderId: 'supplier',
        senderName: 'You',
        content: 'Absolutely! I can deliver them by Thursday actually. I\'ll send you the delivery schedule.',
        timestamp: '2024-01-23T09:15:00Z',
        type: 'text'
      },
      {
        id: 5,
        senderId: 'client',
        senderName: 'Johnson Construction',
        content: 'Perfect! Thank you for the quick delivery of steel beams!',
        timestamp: '2024-01-23T10:30:00Z',
        type: 'text'
      }
    ]
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // TODO: Implement message sending API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your clients</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Active Conversations</p>
          <p className="text-2xl font-bold text-green-600">{conversations.length}</p>
        </div>
      </div>

      {/* Messaging Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedChat?.id === conversation.id ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {conversation.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      conversation.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.clientName}
                      </h3>
                      <span className="text-xs text-gray-500">{formatTime(conversation.timestamp)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{conversation.projectTitle}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.clientName}</h3>
                    <p className="text-sm text-gray-600">{selectedChat.projectTitle}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[selectedChat.id] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'supplier' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'supplier'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'supplier' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;