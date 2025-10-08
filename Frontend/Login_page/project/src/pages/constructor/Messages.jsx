import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Bell, Users } from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Project Manager',
      project: 'Residential Kitchen Remodel',
      lastMessage: 'The inspection is scheduled for tomorrow at 10 AM',
      timestamp: '2 min ago',
      unread: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Client',
      project: 'Office Building Renovation',
      lastMessage: 'Can you send me the updated timeline?',
      timestamp: '1 hour ago',
      unread: true,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Architect',
      project: 'Warehouse Construction',
      lastMessage: 'The revised blueprints are ready for review',
      timestamp: '3 hours ago',
      unread: false,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Client',
      project: 'School Playground Installation',
      lastMessage: 'Great work on the project completion!',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'DP'
    }
  ];


  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi John, I wanted to update you on the kitchen remodel progress.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks Sarah! How are things looking?',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Everything is on schedule. The cabinets installation is complete and we\'re moving on to the countertops.',
      timestamp: '10:33 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      content: 'Excellent! I\'ll send over some progress photos this afternoon.',
      timestamp: '10:35 AM',
      isOwn: true
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      content: 'Perfect. Also, the inspection is scheduled for tomorrow at 10 AM. Can you be there?',
      timestamp: '10:40 AM',
      isOwn: false
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Message',
      description: 'Mike Chen sent you a message about Office Building Renovation',
      time: '5 min ago',
      type: 'message'
    },
    {
      id: 2,
      title: 'Milestone Due',
      description: 'Kitchen Remodel project completion milestone is due tomorrow',
      time: '2 hours ago',
      type: 'deadline'
    },
    {
      id: 3,
      title: 'Payment Received',
      description: 'Payment of $15,000 received for School Playground project',
      time: '1 day ago',
      type: 'payment'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="h-screen flex bg-white">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conversation.role} • {conversation.project}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  SJ
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Sarah Johnson</h2>
                  <p className="text-sm text-gray-600">Project Manager • Residential Kitchen Remodel</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {notification.description}
              </p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Messages;