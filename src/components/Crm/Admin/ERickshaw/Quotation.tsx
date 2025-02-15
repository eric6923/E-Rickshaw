import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, FileText, ClipboardList, Receipt, Pencil, Trash2 } from 'lucide-react';

interface QuotationData {
  id?: string;
  quotationNo: string;
  date: string;
  customerName: string;
  fathersName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  modelName: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

const Quotation = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationData | null>(null);
  
  const [formData, setFormData] = useState<QuotationData>({
    quotationNo: '',
    date: '',
    customerName: '',
    fathersName: '',
    phoneNumber1: '',
    phoneNumber2: '',
    modelName: '',
    amount: 0
  });

  const fetchQuotations = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/quotation');
      const data = await response.json();
      console.log('Fetched quotations:', data);
      setQuotations(data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const getNextQuotationNumber = () => {
    if (quotations.length === 0) return '1';
    
    const numbers = quotations.map(q => parseInt(q.quotationNo));
    const maxNumber = Math.max(...numbers);
    return (maxNumber + 1).toString();
  };

  const handleShowAddDialog = () => {
    const nextQuotationNo = getNextQuotationNumber();
    setFormData({
      ...formData,
      quotationNo: nextQuotationNo,
      date: new Date().toISOString().slice(0, 16)
    });
    setShowAddDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleEdit = (quotation: QuotationData) => {
    const date = new Date(quotation.date);
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                        .toISOString()
                        .slice(0, 16);

    setSelectedQuotation(quotation);
    setFormData({
      ...quotation,
      date: localDate
    });
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/quotation/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchQuotations();
        } else {
          console.error('Failed to delete quotation');
        }
      } catch (error) {
        console.error('Error deleting quotation:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Created quotation:', data);
        await fetchQuotations();
        setShowAddDialog(false);
        setFormData({
          quotationNo: '',
          date: '',
          customerName: '',
          fathersName: '',
          phoneNumber1: '',
          phoneNumber2: '',
          modelName: '',
          amount: 0
        });
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotation?.id) return;
    
    setLoading(true);
    try {
      const utcDate = new Date(formData.date).toISOString();

      const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/quotation/${selectedQuotation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: utcDate
        }),
      });

      if (response.ok) {
        await fetchQuotations();
        setShowEditDialog(false);
        setSelectedQuotation(null);
        setFormData({
          quotationNo: '',
          date: '',
          customerName: '',
          fathersName: '',
          phoneNumber1: '',
          phoneNumber2: '',
          modelName: '',
          amount: 0
        });
      }
    } catch (error) {
      console.error('Error updating quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quotation => 
    quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.quotationNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <Receipt className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quotations</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage customer quotations</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
          <div className="w-full sm:w-[39%]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <button 
              onClick={handleShowAddDialog}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Table/Cards Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Quotation Number</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Father's Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Phone Number 1</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Phone Number 2</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Model Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No quotations found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4 text-center whitespace-nowrap">{quotation.quotationNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(quotation.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.fathersName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.phoneNumber1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.phoneNumber2}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.modelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{quotation.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(quotation)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => quotation.id && handleDelete(quotation.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {filteredQuotations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No quotations found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredQuotations.map((quotation) => (
                <div key={quotation.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {quotation.quotationNo}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(quotation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(quotation)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => quotation.id && handleDelete(quotation.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="text-gray-900 dark:text-white">{quotation.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Father's Name</p>
                        <p className="text-gray-900 dark:text-white">{quotation.fathersName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone 1</p>
                        <p className="text-gray-900 dark:text-white">{quotation.phoneNumber1}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone 2</p>
                        <p className="text-gray-900 dark:text-white">{quotation.phoneNumber2}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Model</p>
                        <p className="text-gray-900 dark:text-white">{quotation.modelName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          ₹{quotation.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Quotation Dialog */}
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
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Quotation</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quotation Number
                  </label>
                  <input
                    type="text"
                    value={formData.quotationNo}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number 1
                  </label>
                  <input
                    type="text"
                    name="phoneNumber1"
                    value={formData.phoneNumber1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number 2
                  </label>
                  <input
                    type="text"
                    name="phoneNumber2"
                    value={formData.phoneNumber2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model Name
                  </label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  {loading ? 'Adding...' : 'Add Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Quotation Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedQuotation(null);
              }}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Quotation</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quotation Number
                  </label>
                  <input
                    type="text"
                    name="quotationNo"
                    value={formData.quotationNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number 1
                  </label>
                  <input
                    type="text"
                    name="phoneNumber1"
                    value={formData.phoneNumber1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number 2
                  </label>
                  <input
                    type="text"
                    name="phoneNumber2"
                    value={formData.phoneNumber2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model Name
                  </label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedQuotation(null);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;