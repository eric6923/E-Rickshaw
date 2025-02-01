import React, { useState } from 'react';
import { Download, Search, X } from 'lucide-react';

const Defaulter = () => {
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [defaulters, setDefaulters] = useState([]);
  
  const [certificateFormData, setCertificateFormData] = useState({
    candidateName: '',
    branchName: '',
    rikshawName: '',
    chasisNumber: '',
    paidAmount: '',
    discount: '',
    invoiceNumber: '',
    collectedBy: ''
  });

  const handleCertificateInputChange = (e:any) => {
    const { name, value } = e.target;
    setCertificateFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCertificateSubmit = (e:any) => {
    e.preventDefault();
    console.log('Generated Certificate Data:', certificateFormData);
    setShowCertificateDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Defaulter Reports</h1>
          <div className="flex gap-4 mr-24">
            <div className="relative">
              <input
                type="text"
                placeholder="Search defaulters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-5 w-5" />
              Download
            </button>
            <button 
              onClick={() => setShowCertificateDialog(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Generate Certificate
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[2000px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Father Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">RikShaw Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Chasis Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Pending Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Sale By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Register Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Customer Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Mobile 1st</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Mobile 2nd</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Sale Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Bank Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap">Loan By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 whitespace-nowrap w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {defaulters.length === 0 ? (
                  <tr>
                    <td colSpan="16" className="text-center py-4 text-gray-500 dark:text-gray-400">
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

        {/* Generate Certificate Dialog */}
        {showCertificateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-[900px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => setShowCertificateDialog(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Generate Certificate</h2>
              <form onSubmit={handleCertificateSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      name="candidateName"
                      value={certificateFormData.candidateName}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch Name</label>
                    <input
                      type="text"
                      name="branchName"
                      value={certificateFormData.branchName}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RikShaw Name</label>
                    <input
                      type="text"
                      name="rikshawName"
                      value={certificateFormData.rikshawName}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chasis Number</label>
                    <input
                      type="text"
                      name="chasisNumber"
                      value={certificateFormData.chasisNumber}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paid Amount</label>
                    <input
                      type="text"
                      name="paidAmount"
                      value={certificateFormData.paidAmount}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount</label>
                    <input
                      type="text"
                      name="discount"
                      value={certificateFormData.discount}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={certificateFormData.invoiceNumber}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collected By</label>
                    <input
                      type="text"
                      name="collectedBy"
                      value={certificateFormData.collectedBy}
                      onChange={handleCertificateInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setShowCertificateDialog(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Generate Certificate
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