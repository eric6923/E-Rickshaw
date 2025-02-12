import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, Wrench, ClipboardList, FileSpreadsheet, Edit, Trash2, Pencil } from 'lucide-react';

interface JobCardData {
  id?: number;
  date: string;
  customerName: string;
  chassisNumber: string;
  workerName: string;
  notes: string;
  itemName: string;
  quantity: number;
  msp: number;
  total: number;
  servicing: string;
  labourCharges: number;
  grandTotal: number;
  createdAt?: string;
}

const initialFormState: JobCardData = {
  date: new Date().toISOString().split('T')[0],
  customerName: '',
  chassisNumber: '',
  workerName: '',
  notes: '',
  itemName: '',
  quantity: 0,
  msp: 0,
  total: 0,
  servicing: '',
  labourCharges: 0,
  grandTotal: 0
};

const JobCard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobCards, setJobCards] = useState<JobCardData[]>([]);
  const [formData, setFormData] = useState<JobCardData>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobCards();
  }, []);

  const fetchJobCards = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/spares/jobcard');
      const data = await response.json();
      setJobCards(data);
    } catch (error) {
      console.error('Error fetching job cards:', error);
      setError('Failed to fetch job cards');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevState => {
      if (name === 'quantity' || name === 'msp' || name === 'labourCharges') {
        const numValue = value === '' ? 0 : Number(value);
        const newState = { ...prevState };
        
        if (name === 'quantity') {
          newState.quantity = numValue;
          newState.total = numValue * prevState.msp;
        } else if (name === 'msp') {
          newState.msp = numValue;
          newState.total = prevState.quantity * numValue;
        } else if (name === 'labourCharges') {
          newState.labourCharges = numValue;
        }
        
        newState.grandTotal = newState.total + newState.labourCharges;
        return newState;
      }
      
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const dateObj = new Date(formData.date);
      dateObj.setUTCHours(12, 0, 0, 0);
      
      const submitData = {
        ...formData,
        date: dateObj.toISOString(),
        quantity: Number(formData.quantity),
        msp: Number(formData.msp),
        total: Number(formData.total),
        labourCharges: Number(formData.labourCharges),
        grandTotal: Number(formData.grandTotal)
      };

      const url = isEditing 
        ? `https://dataentry-one.vercel.app/spares/jobcard/${formData.id}`
        : 'https://dataentry-one.vercel.app/spares/jobcard';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchJobCards();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving job card:', error);
      setError('Failed to save job card. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this job card?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/spares/jobcard/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchJobCards();
      } catch (error) {
        console.error('Error deleting job card:', error);
        setError('Failed to delete job card');
      }
    }
  };

  const handleEdit = (card: JobCardData) => {
    const dateObj = new Date(card.date);
    const formattedDate = dateObj.toISOString().split('T')[0];

    setFormData({
      ...card,
      date: formattedDate,
      quantity: Number(card.quantity),
      msp: Number(card.msp),
      total: Number(card.total),
      labourCharges: Number(card.labourCharges),
      grandTotal: Number(card.grandTotal)
    });
    setIsEditing(true);
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setFormData(initialFormState);
    setIsEditing(false);
    setError(null);
  };

  const filteredJobCards = jobCards.filter(card => 
    card.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.workerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl mb-6 md:mb-0">
              <FileSpreadsheet className="h-8 w-8 text-white " />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Job Cards
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage service job cards and track repairs
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
  <div className="w-full sm:w-[39%]">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        placeholder="Search job cards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  </div>
  <div className="self-end sm:self-auto w-full sm:w-auto flex justify-end">
    <button 
      onClick={() => setShowAddDialog(true)}
      className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors md:mr-8"
    >
      <Plus className="h-5 w-5" />
      Add Job Card
    </button>
  </div>
</div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chassis</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">MSP</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Labour</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Grand Total</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobCards.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Wrench className="h-8 w-8 text-gray-400" />
                        <p>No job cards found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobCards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(card.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.chassisNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.workerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₹{card.msp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₹{card.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{card.servicing}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₹{card.labourCharges}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">₹{card.grandTotal}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{card.notes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(card)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(card.id!)}
                            className="text-red-600 hover:text-red-800"
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
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredJobCards.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <Wrench className="h-8 w-8 text-gray-400" />
                <p>No job cards found</p>
              </div>
            </div>
          ) : (
            filteredJobCards.map((card) => (
              <div key={card.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{card.customerName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(card.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(card.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Chassis</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{card.chassisNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Worker</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{card.workerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Item</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{card.itemName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{card.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">MSP</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{card.msp}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{card.total}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Service</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{card.servicing}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Labour</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{card.labourCharges}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Notes</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{card.notes}</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-400">Grand Total</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">₹{card.grandTotal}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Job Card Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {isEditing ? 'Edit Job Card' : 'New Job Card'}
                </h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

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
                      name="chassisNumber"
                      value={formData.chassisNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Worker Name</label>
                    <input
                      type="text"
                      name="workerName"
                      value={formData.workerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MSP</label>
                    <input
                      type="number"
                      name="msp"
                      value={formData.msp || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total</label>
                    <input
                      type="number"
                      name="total"
                      value={formData.total}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Servicing</label>
                    <input
                      type="text"
                      name="servicing"
                      value={formData.servicing}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Labour Charges</label>
                    <input
                      type="number"
                      name="labourCharges"
                      value={formData.labourCharges || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grand Total</label>
                    <input
                      type="number"
                      name="grandTotal"
                      value={formData.grandTotal}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    {isEditing ? 'Update' : 'Save'}
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

export default JobCard;