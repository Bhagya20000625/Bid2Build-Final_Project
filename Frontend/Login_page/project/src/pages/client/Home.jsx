import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, DollarSign, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import SummaryCard from '../../components/client/SummaryCard';
import ActivityTimeline from '../../components/client/ActivityTimeline';

const Home = () => {
  const navigate = useNavigate();

  const summaryData = [
    {
      title: 'Active Projects',
      value: '8',
      subtitle: '3 nearing completion',
      icon: TrendingUp,
      color: 'blue',
      progress: 75
    },
    {
      title: 'Pending Bids',
      value: '12',
      subtitle: '5 new today',
      icon: Clock,
      color: 'amber',
      progress: 60
    },
    {
      title: 'Payments Due',
      value: '$45,200',
      subtitle: '2 milestones ready',
      icon: DollarSign,
      color: 'green',
      progress: 80
    },
    {
      title: 'Unread Messages',
      value: '7',
      subtitle: '3 urgent',
      icon: Bell,
      color: 'red',
      progress: 40
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah</h1>
        <p className="text-gray-600">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityTimeline />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer-dashboard/post-project')}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>Post New Project</span>
                </button>
                <button
                onClick={() => navigate('/customer-dashboard/view-bids')}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <span>Review Pending Bids</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">On Track</span>
                </div>
                <span className="text-green-600 font-semibold">5 projects</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-gray-700">Attention Needed</span>
                </div>
                <span className="text-amber-600 font-semibold">3 projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;