import React, { useState, useEffect } from 'react';
import {Plus, Search, X, FileCheck, ClipboardList, Pencil, Trash2 } from 'lucide-react';

interface RCBook {
  id: string;
  customerName: string;
  chassisNo: string;
  registrationNo: string;
  pendingAmount: number;
  noPlateReceived: string;
  noPlateReceivedDate: string;
  rcBookReceived: string;
  rcBookReceivedDate: string;
  noPlateGiven: string;
  rcBookGiven: string;
  createdAt: string;
  updatedAt: string;
}

const RCBook = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rcBooks, setRcBooks] = useState<RCBook[]>([]);
  const [editingRcBook, setEditingRcBook] = useState<RCBook | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    chassisNo: '',
    registrationNo: '',
    pendingAmount: '',
    noPlateReceived: 'No',
    noPlateReceivedDate: '',
    rcBookReceived: 'No',
    rcBookReceivedDate: '',
    noPlateGiven: 'No',
    rcBookGiven: 'No'
  });

  const fetchRcBooks = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/rcbook');
      if (!response.ok) {
        throw new Error('Failed to fetch RC books');
      }
      const data = await response.json();
      setRcBooks(data);
    } catch (error) {
      console.error('Error fetching RC books:', error);
    }
  };

  useEffect(() => {
    fetchRcBooks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      chassisNo: '',
      registrationNo: '',
      pendingAmount: '',
      noPlateReceived: 'No',
      noPlateReceivedDate: '',
      rcBookReceived: 'No',
      rcBookReceivedDate: '',
      noPlateGiven: 'No',
      rcBookGiven: 'No'
    });
    setEditingRcBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const noPlateDate = formData.noPlateReceivedDate ? 
      new Date(formData.noPlateReceivedDate + 'T00:00:00.000Z').toISOString() : 
      null;
    
    const rcBookDate = formData.rcBookReceivedDate ? 
      new Date(formData.rcBookReceivedDate + 'T00:00:00.000Z').toISOString() : 
      null;

    const payload = {
      customerName: formData.customerName,
      chassisNo: formData.chassisNo,
      registrationNo: formData.registrationNo,
      pendingAmount: Number(formData.pendingAmount),
      noPlateReceived: formData.noPlateReceived,
      noPlateReceivedDate: noPlateDate,
      rcBookReceived: formData.rcBookReceived,
      rcBookReceivedDate: rcBookDate,
      noPlateGiven: formData.noPlateGiven,
      rcBookGiven: formData.rcBookGiven
    };

    try {
      if (editingRcBook) {
        const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/rcbook/${editingRcBook.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update RC book');
        }
      } else {
        const response = await fetch('https://dataentry-one.vercel.app/rickshaw/rcbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create RC book');
        }
      }
      
      await fetchRcBooks();
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving RC book:', error);
    }
  };

  const handleEdit = (rcBook: RCBook) => {
    setEditingRcBook(rcBook);
    setFormData({
      customerName: rcBook.customerName,
      chassisNo: rcBook.chassisNo,
      registrationNo: rcBook.registrationNo,
      pendingAmount: rcBook.pendingAmount.toString(),
      noPlateReceived: rcBook.noPlateReceived,
      noPlateReceivedDate: rcBook.noPlateReceivedDate ? 
        new Date(rcBook.noPlateReceivedDate).toISOString().split('T')[0] : '',
      rcBookReceived: rcBook.rcBookReceived,
      rcBookReceivedDate: rcBook.rcBookReceivedDate ? 
        new Date(rcBook.rcBookReceivedDate).toISOString().split('T')[0] : '',
      noPlateGiven: rcBook.noPlateGiven,
      rcBookGiven: rcBook.rcBookGiven
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this RC book?')) {
      try {
        await fetch(`https://dataentry-one.vercel.app/rickshaw/rcbook/${id}`, {
          method: 'DELETE',
        });
        await fetchRcBooks();
      } catch (error) {
        console.error('Error deleting RC book:', error);
      }
    }
  };

  const filteredRcBooks = rcBooks.filter(rcBook =>
    rcBook.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rcBook.chassisNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rcBook.registrationNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl -mt-12 sm:mt-0">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                RC Book Management
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage RC book details and track document status
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-[39%] ml-0 sm:ml-96">
              <div className="relative ml-0 sm:ml-36">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search RC books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full sm:w-auto justify-end">
              <button 
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-0 sm:mr-10"
              >
                <Plus className="h-5 w-5" />
                Add RC Book
              </button>
            </div>
          </div>
        </div>

        {/* Table Section (Desktop) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Chassis Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Registration Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Pending Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Number Plate Received</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Number Plate Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">RC Book Received</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">RC Book Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Number Plate Given</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">RC Book Given</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRcBooks.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="h-8 w-8 text-gray-400" />
                        <p>No RC books found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRcBooks.map((rcBook, index) => (
                    <tr key={rcBook.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.chassisNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.registrationNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.pendingAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.noPlateReceived}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(rcBook.noPlateReceivedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.rcBookReceived}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(rcBook.rcBookReceivedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.noPlateGiven}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{rcBook.rcBookGiven}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(rcBook)}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(rcBook.id)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

          {/* Mobile View (Cards) */}
          <div className="md:hidden">
            {filteredRcBooks.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                  <p>No RC books found</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRcBooks.map((rcBook, index) => (
                  <div key={rcBook.id} className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rcBook.customerName}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(rcBook)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rcBook.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Chassis Number</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{rcBook.chassisNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Registration Number</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{rcBook.registrationNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Pending Amount</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{rcBook.pendingAmount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Number Plate Status</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Received: {rcBook.noPlateReceived}<br />
                          Date: {new Date(rcBook.noPlateReceivedDate).toLocaleDateString()}<br />
                          Given: {rcBook.noPlateGiven}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">RC Book Status</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Received: {rcBook.rcBookReceived}<br />
                          Date: {new Date(rcBook.rcBookReceivedDate).toLocaleDateString()}<br />
                          Given: {rcBook.rcBookGiven}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit RC Book Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[90%] sm:w-[600px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <FileCheck className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingRcBook ? 'Edit RC Book' : 'Add New RC Book'}
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chassis Number</label>
                    <input
                      type="text"
                      name="chassisNo"
                      value={formData.chassisNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNo"
                      value={formData.registrationNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pending Amount</label>
                    <input
                      type="number"
                      name="pendingAmount"
                      value={formData.pendingAmount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number Plate Received</label>
                    <select
                      name="noPlateReceived"
                      value={formData.noPlateReceived}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number Plate Received Date</label>
                    <input
                      type="date"
                      name="noPlateReceivedDate"
                      value={formData.noPlateReceivedDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Book Received</label>
                    <select
                      name="rcBookReceived"
                      value={formData.rcBookReceived}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Book Received Date</label>
                    <input
                      type="date"
                      name="rcBookReceivedDate"
                      value={formData.rcBookReceivedDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number Plate Given</label>
                    <select
                      name="noPlateGiven"
                      value={formData.noPlateGiven}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RC Book Given</label>
                    <select
                      name="rcBookGiven"
                      value={formData.rcBookGiven}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddDialog(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingRcBook ? 'Update' : 'Add RC Book'}
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

export default RCBook;