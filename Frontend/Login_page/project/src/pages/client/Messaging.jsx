import React, { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Phone, Video } from 'lucide-react';

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'ABC Construction Co.',
      type: 'Contractor',
      lastMessage: 'The foundation work is completed and ready for inspection.',
      timestamp: '2 hours ago',
      unread: 2,
      avatar: 'AC',
      online: true
    },
    {
      id: 2,
      name: 'BuildMaster Ltd.',
      type: 'Contractor',
      lastMessage: 'Can we schedule a meeting to discuss the timeline changes?',
      timestamp: '5 hours ago',
      unread: 1,
      avatar: 'BM',
      online: false
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      type: 'Architect',
      lastMessage: 'I\'ve updated the blueprints based on your feedback.',
      timestamp: '1 day ago',
      unread: 0,
      avatar: 'SJ',
      online: true
    },
    {
      id: 4,
      name: 'MetalWorks Supply',
      type: 'Supplier',
      lastMessage: 'Your steel beams order is ready for delivery.',
      timestamp: '2 days ago',
      unread: 0,
      avatar: 'MW',
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: 'ABC Construction Co.',
      message: 'Good morning! I wanted to update you on the foundation progress.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      senderId: 'me',
      senderName: 'You',
      message: 'That\'s great to hear! How are we tracking against the timeline?',
      timestamp: '10:35 AM',
      isOwn: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'ABC Construction Co.',
      message: 'We\'re actually ahead of schedule by 2 days. The weather has been favorable.',
      timestamp: '10:37 AM',
      isOwn: false
    },
    {
      id: 4,
      senderId: 1,
      senderName: 'ABC Construction Co.',
      message: 'The foundation work is completed and ready for inspection. Can you arrange for the city inspector to come by this week?',
      timestamp: '2 hours ago',
      isOwn: false
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

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
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                selectedChat === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    conversation.type === 'Contractor' ? 'bg-blue-600' :
                    conversation.type === 'Architect' ? 'bg-purple-600' : 'bg-green-600'
                  }`}>
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    conversation.type === 'Contractor' ? 'bg-blue-100 text-blue-800' :
                    conversation.type === 'Architect' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {conversation.type}
                  </span>
                </div>
              </div>
            </button>
          ))}
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
                      selectedConversation.type === 'Contractor' ? 'bg-blue-600' :
                      selectedConversation.type === 'Architect' ? 'bg-purple-600' : 'bg-green-600'
                    }`}>
                      {selectedConversation.avatar}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.online ? 'Online' : 'Last seen 2 hours ago'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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