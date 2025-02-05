import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, FileText, ClipboardList } from 'lucide-react';

interface DocumentData {
  id?: string;
  customerName: string;
  aadharCard: string;
  panCard: string;
  homeLocation: string;
  voterIdOrDL: string;
  salesInvoiceWithDS: File | string;
  batterySaleInvoice: File | string;
  salesCertificateWithDS: File | string;
  insurance: File | string;
  livePhoto: File | string;
  signaturePhoto: File | string;
  createdAt?: string;
  updatedAt?: string;
}

const Documents = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<DocumentData>({
    customerName: '',
    aadharCard: '',
    panCard: '',
    homeLocation: '',
    voterIdOrDL: '',
    salesInvoiceWithDS: '',
    batterySaleInvoice: '',
    salesCertificateWithDS: '',
    insurance: '',
    livePhoto: '',
    signaturePhoto: ''
  });

  const fetchDocuments = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/document');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files?.[0];
      if (file) {
        setFormData(prevState => ({
          ...prevState,
          [name]: file
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          aadharCard: formData.aadharCard,
          panCard: formData.panCard,
          homeLocation: formData.homeLocation,
          voterIdOrDL: formData.voterIdOrDL,
          salesInvoiceWithDS: formData.salesInvoiceWithDS instanceof File ? formData.salesInvoiceWithDS.name : formData.salesInvoiceWithDS,
          batterySaleInvoice: formData.batterySaleInvoice instanceof File ? formData.batterySaleInvoice.name : formData.batterySaleInvoice,
          salesCertificateWithDS: formData.salesCertificateWithDS instanceof File ? formData.salesCertificateWithDS.name : formData.salesCertificateWithDS,
          insurance: formData.insurance instanceof File ? formData.insurance.name : formData.insurance,
          livePhoto: formData.livePhoto instanceof File ? formData.livePhoto.name : formData.livePhoto,
          signaturePhoto: formData.signaturePhoto instanceof File ? formData.signaturePhoto.name : formData.signaturePhoto,
        }),
      });

      if (response.ok) {
        await fetchDocuments();
        setShowAddDialog(false);
        setFormData({
          customerName: '',
          aadharCard: '',
          panCard: '',
          homeLocation: '',
          voterIdOrDL: '',
          salesInvoiceWithDS: '',
          batterySaleInvoice: '',
          salesCertificateWithDS: '',
          insurance: '',
          livePhoto: '',
          signaturePhoto: ''
        });
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.aadharCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.panCard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-purple-600 dark:bg-purple-500 p-3 rounded-xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Documents</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage customer documents and records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mr-64">
          <div className="w-full sm:w-[39%]">
            <div className="relative ml-28">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors">
              <Download className="h-5 w-5" />
              Download
            </button>
            <button 
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Documents
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aadhar Card</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pan Card</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Home Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Voter's ID/DL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sales Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Battery Sales Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sales Certificates</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Insurance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No documents found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4 whitespace-nowrap">{doc.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.aadharCard}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.panCard}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.homeLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.voterIdOrDL}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{doc.salesInvoiceWithDS}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.batterySaleInvoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.salesCertificateWithDS}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.insurance}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.livePhoto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{doc.signaturePhoto}</td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Documents Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowAddDialog(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Documents</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Text inputs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aadhar Card
                  </label>
                  <input
                    type="text"
                    name="aadharCard"
                    value={formData.aadharCard}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pan Card
                  </label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Home Location
                  </label>
                  <input
                    type="text"
                    name="homeLocation"
                    value={formData.homeLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Voter's ID/DL
                  </label>
                  <input
                    type="text"
                    name="voterIdOrDL"
                    value={formData.voterIdOrDL}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* File inputs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sales Invoice with DS
                  </label>
                  <input
                    type="file"
                    name="salesInvoiceWithDS"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Battery Sale Invoice
                  </label>
                  <input
                    type="file"
                    name="batterySaleInvoice"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sales Certificate with DS
                  </label>
                  <input
                    type="file"
                    name="salesCertificateWithDS"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insurance
                  </label>
                  <input
                    type="file"
                    name="insurance"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live Photo
                  </label>
                  <input
                    type="file"
                    name="livePhoto"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Signature Photo
                  </label>
                  <input
                    type="file"
                    name="signaturePhoto"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Documents'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;