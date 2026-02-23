import React from 'react';
import { CheckCircle, Clock, DollarSign, MessageSquare, FileText } from 'lucide-react';

const ActivityTimeline = () => {
  const activities = [
    {
      id: 1,
      type: 'bid_received',
      title: 'New bid received for Downtown Office Complex',
      description: 'ABC Construction submitted a bid for $125,000',
      time: '2 hours ago',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      type: 'payment_due',
      title: 'Payment milestone reached',
      description: 'Residential Project - Phase 2 completion ready for payment',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from contractor',
      description: 'John from BuildMaster has sent you an update',
      time: '6 hours ago',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      id: 4,
      type: 'progress',
      title: 'Project milestone completed',
      description: 'Foundation work completed for Retail Store Project',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 5,
      type: 'pending',
      title: 'Waiting for architect approval',
      description: 'Shopping Mall renovation plans pending review',
      time: '2 days ago',
      icon: Clock,
      color: 'amber'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple: 'text-purple-600 bg-purple-50',
      amber: 'text-amber-600 bg-amber-50'
    };
    return colors[color] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(activity.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{activity.title}</h4>
                  <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;