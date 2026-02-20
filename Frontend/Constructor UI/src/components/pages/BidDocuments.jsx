import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Eye, Plus } from 'lucide-react';

const BidDocuments = () => {
  const [dragActive, setDragActive] = useState(false);

  const documents = [
    {
      id: 1,
      name: 'Business License.pdf',
      size: '2.5 MB',
      uploadDate: '2025-03-10',
      category: 'Legal',
      project: 'Office Building Renovation'
    },
    {
      id: 2,
      name: 'Insurance Certificate.pdf',
      size: '1.8 MB',
      uploadDate: '2025-01-08',
      category: 'Insurance',
      project: 'All Projects'
    },
    {
      id: 3,
      name: 'Technical Specifications.docx',
      size: '3.2 MB',
      uploadDate: '2025-01-12',
      category: 'Technical',
      project: 'Warehouse Construction'
    },
    {
      id: 4,
      name: 'Project Timeline.pdf',
      size: '1.1 MB',
      uploadDate: '2025-01-09',
      category: 'Planning',
      project: 'Kitchen Remodel'
    },
    {
      id: 5,
      name: 'Cost Breakdown.xlsx',
      size: '956 KB',
      uploadDate: '2025-01-11',
      category: 'Financial',
      project: 'School Playground'
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Legal': 'bg-blue-100 text-blue-800',
      'Insurance': 'bg-green-100 text-green-800',
      'Technical': 'bg-purple-100 text-purple-800',
      'Planning': 'bg-yellow-100 text-yellow-800',
      'Financial': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bid Documents</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-600 mb-4">
          Support for PDF, DOC, DOCX, XLS, XLSX files up to 10MB
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Files
        </label>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Uploaded Documents</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <div key={doc.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{doc.project}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Legal Documents', count: 3, color: 'blue' },
          { name: 'Insurance', count: 2, color: 'green' },
          { name: 'Technical Specs', count: 4, color: 'purple' },
          { name: 'Financial', count: 5, color: 'red' }
        ].map((category) => (
          <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{category.name}</p>
                <p className="text-2xl font-bold text-gray-900">{category.count}</p>
              </div>
              <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                <FileText className={`h-6 w-6 text-${category.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidDocuments;