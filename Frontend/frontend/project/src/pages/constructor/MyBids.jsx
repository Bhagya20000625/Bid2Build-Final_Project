import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import bidService from '../../services/bidService.js';


const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load constructor's bids on component mount
  useEffect(() => {
    loadMyBids();
  }, []);

  // Filter bids when status filter or search term changes
  useEffect(() => {
    filterBids();
  }, [bids, statusFilter, searchTerm]);

  const loadMyBids = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get constructor ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const constructorId = user.id;

      if (!constructorId) {
        setError('Constructor ID not found. Please log in again.');
        return;
      }

      const result = await bidService.getBidderBids(constructorId);

      if (result.success && result.bids) {
        // Process bids to ensure unique entries and proper formatting
        const uniqueBids = result.bids.reduce((acc, bid) => {
          // Use project_id + bid_id as unique key to avoid duplicates
          const key = `${bid.project_id}-${bid.id}`;
          if (!acc[key]) {
            acc[key] = {
              ...bid,
              project_title: bid.item_title || bid.project_title || 'Untitled Project',
              customer_name: `${bid.customer_first_name || ''} ${bid.customer_last_name || ''}`.trim() || 'Unknown Customer',
              bid_amount: parseFloat(bid.bid_amount || 0),
              submitted_date: new Date(bid.submitted_at).toLocaleDateString(),
              responded_date: bid.responded_at ? new Date(bid.responded_at).toLocaleDateString() : null
            };
          }
          return acc;
        }, {});

        setBids(Object.values(uniqueBids));
      } else {
        setBids([]);
      }
    } catch (error) {
      console.error('Error loading bids:', error);
      setError('Failed to load bids');
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBids = () => {
    let filtered = bids;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(bid =>
        bid.project_title?.toLowerCase().includes(searchLower) ||
        bid.customer_name?.toLowerCase().includes(searchLower) ||
        bid.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBids(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBidStats = () => {
    const total = bids.length;
    const accepted = bids.filter(bid => bid.status === 'accepted').length;
    const rejected = bids.filter(bid => bid.status === 'rejected').length;
    const pending = bids.filter(bid => bid.status === 'pending').length;

    return { total, accepted, rejected, pending };
  };

  const stats = getBidStats();

  if (loading && bids.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your bids...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
          <p className="text-gray-600">Track the status of all your submitted bids</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, customers, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === 'all' ? 'No bids found' : `No ${statusFilter} bids`}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : statusFilter === 'all'
              ? "You haven't submitted any bids yet"
              : `You don't have any ${statusFilter} bids`
            }
          </p>
          {statusFilter === 'all' && !searchTerm && (
            <a
              href="/constructor-dashboard/browse-projects"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Projects
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredBids.length} Bid{filteredBids.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' && ` (${statusFilter})`}
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredBids.map((bid) => (
              <div key={`${bid.project_id}-${bid.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Project Title and Status */}
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(bid.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{bid.project_title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bid.status)}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">${bid.bid_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{bid.proposed_timeline || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{bid.customer_name}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{bid.description}</p>

                    {/* Dates */}
                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                      <span>Submitted: {bid.submitted_date}</span>
                      {bid.responded_date && (
                        <span>Responded: {bid.responded_date}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    {bid.status === 'accepted' && (
                      <a
                        href="/constructor-dashboard/active-projects"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;