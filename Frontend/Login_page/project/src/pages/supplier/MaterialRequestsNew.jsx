import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, Eye, Send } from 'lucide-react';

const MaterialRequestsNew = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/material-requests');
      const data = await response.json();
      console.log('Fetched data:', data);
      
      if (data.success && data.materialRequests) {
        setRequests(data.materialRequests);
      }
    } catch (error) {
      console.error('Error:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Material Requests</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchRequests}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh ({requests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No material requests found</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                <p className="text-gray-600">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <p>{request.category}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p>{request.quantity}</p>
                </div>
                <div>
                  <span className="font-medium">Client:</span>
                  <p>{request.first_name} {request.last_name}</p>
                </div>
                <div>
                  <span className="font-medium">Deadline:</span>
                  <p>{new Date(request.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 border rounded hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quotation
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialRequestsNew;