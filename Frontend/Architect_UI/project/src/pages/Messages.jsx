import React, { useState } from 'react';
import Header from '../components/Header';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Bell } from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Project Manager at Green Valley',
      project: 'Modern Residential Complex',
      lastMessage: 'Great work on the initial designs! Can we schedule a review meeting?',
      timestamp: '10:30 AM',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Developer at TechCorp',
      project: 'Corporate Headquarters Renovation',
      lastMessage: 'The budget proposal looks good. When can we see the floor plans?',
      timestamp: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'City Planning Director',
      project: 'Community Arts Center',
      lastMessage: 'We need to discuss the zoning requirements for the project.',
      timestamp: '2 days ago',
      unread: 1,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi! I reviewed your proposal for the residential complex. The sustainable design approach is exactly what we\'re looking for.',
      timestamp: '9:15 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'Me',
      content: 'Thank you! I believe incorporating green building practices will not only reduce environmental impact but also provide long-term cost savings for residents.',
      timestamp: '9:18 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Absolutely. Can you walk me through the energy efficiency features you\'ve planned?',
      timestamp: '9:20 AM',
      isMe: false
    },
    {
      id: 4,
      sender: 'Me',
      content: 'Of course! I\'ve integrated solar panels, high-efficiency HVAC systems, and smart home technology. I can send you the detailed specifications.',
      timestamp: '9:25 AM',
      isMe: true
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      content: 'Great work on the initial designs! Can we schedule a review meeting?',
      timestamp: '10:30 AM',
      isMe: false
    }
  ];

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 h-screen flex">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conv.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {conv.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-blue-600 mb-1">{conv.project}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate pr-2">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {conv.unread}
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
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedConv.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {selectedConv.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConv.name}</h2>
                    <p className="text-sm text-gray-600">{selectedConv.role}</p>
                    <p className="text-xs text-blue-600">{selectedConv.project}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md px-4 py-3 rounded-lg ${
                    message.isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;