import React, { useState } from 'react';
import { Download, Plus, Search, X } from 'lucide-react';

const Defaulter = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [defaulters, setDefaulters] = useState([]);
  
  // New state for form fields
  const [formData, setFormData] = useState({
    customerName: '',
    fatherName: '',
    rikshawName: '',
    chasisNumber: '',
    pendingAmount: '',
    branch: '',
    saleBy: '',
    registerName: '',
    customerAddress: '',
    mobile1st: '',
    mobile2nd: '',
    saleDate: '',
    dueDate: '',
    bankName: '',
    loanBy: ''
  });

  // Handle input changes for form
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission (currently just logs the data)
  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Submitted Defaulter Data:', formData);
    // You can add logic to add to defaulters list or send to backend here
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Defaulter Management</h1>
          <div className="flex gap-4 mr-24">
            <div className="relative">
              <input
                type="text"
                placeholder="Search defaulters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-5 w-5" />
              Download
            </button>
            <button 
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Defaulter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden ">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[2000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Father Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">RikShaw Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Chasis Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Pending Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Sale By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Register Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Customer Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Mobile 1st</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Mobile 2nd</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Sale Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">Bank Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap w-44">Loan By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {defaulters.length === 0 ? (
                  <tr>
                    <td colSpan="16" className="text-center py-4 text-gray-500">
                      No defaulters found
                    </td>
                  </tr>
                ) : (
                  defaulters.map((defaulter, index) => (
                    <tr key={index}>
                      {/* Render defaulter data here */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Defaulter Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-[900px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => setShowAddDialog(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Defaulter</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RikShaw Name</label>
                    <input
                      type="text"
                      name="rikshawName"
                      value={formData.rikshawName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chasis Number</label>
                    <input
                      type="text"
                      name="chasisNumber"
                      value={formData.chasisNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pending Amount</label>
                    <input
                      type="text"
                      name="pendingAmount"
                      value={formData.pendingAmount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale By</label>
                    <input
                      type="text"
                      name="saleBy"
                      value={formData.saleBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Register Name</label>
                    <input
                      type="text"
                      name="registerName"
                      value={formData.registerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
                    <input
                      type="text"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile 1st</label>
                    <input
                      type="text"
                      name="mobile1st"
                      value={formData.mobile1st}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile 2nd</label>
                    <input
                      type="text"
                      name="mobile2nd"
                      value={formData.mobile2nd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Date</label>
                    <input
                      type="date"
                      name="saleDate"
                      value={formData.saleDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan By</label>
                    <input
                      type="text"
                      name="loanBy"
                      value={formData.loanBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                <button 
                    type="button"
                    onClick={() => setShowAddDialog(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Defaulter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Defaulter;