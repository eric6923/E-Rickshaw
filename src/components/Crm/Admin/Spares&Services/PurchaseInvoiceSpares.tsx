import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, ClipboardList, Pencil, Trash2 } from 'lucide-react';

interface PurchaseInvoice {
  id?: number;
  invoiceNo: string;
  date: string;
  supplierName: string;
  itemName: string;
  quantity: number;
  purchaseRate: number;
  totalRate: number;
  gst: number;
  grandTotal: number;
  createdAt?: string;
}

function App() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  
  const [formData, setFormData] = useState<PurchaseInvoice>({
    invoiceNo: '',
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    supplierName: '',
    itemName: '',
    quantity: 0,
    purchaseRate: 0,
    totalRate: 0,
    gst: 0,
    grandTotal: 0
  });

  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/spares/pinv');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const calculateTotals = (data: Partial<PurchaseInvoice>) => {
    const quantity = Number(data.quantity) || 0;
    const purchaseRate = Number(data.purchaseRate) || 0;
    const gst = Number(data.gst) || 0;

    const totalRate = quantity * purchaseRate;
    const gstAmount = (totalRate * gst) / 100;
    const grandTotal = totalRate + gstAmount;

    return {
      totalRate,
      grandTotal
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    
    const updatedData = {
      ...formData,
      [name]: newValue
    };

    if (['quantity', 'purchaseRate', 'gst'].includes(name)) {
      const { totalRate, grandTotal } = calculateTotals(updatedData);
      updatedData.totalRate = totalRate;
      updatedData.grandTotal = grandTotal;
    }

    setFormData(updatedData);
  };

  const handleEdit = (invoice: PurchaseInvoice) => {
    const date = new Date(invoice.date);
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                        .toISOString()
                        .slice(0, 16);

    setSelectedInvoice(invoice);
    setFormData({
      ...invoice,
      date: localDate
    });
    setShowEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/spares/pinv/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchInvoices();
        } else {
          console.error('Failed to delete invoice');
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://dataentry-one.vercel.app/spares/pinv', {
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
        await fetchInvoices();
        setShowAddDialog(false);
        setFormData({
          invoiceNo: '',
          date: new Date().toISOString().slice(0, 16),
          supplierName: '',
          itemName: '',
          quantity: 0,
          purchaseRate: 0,
          totalRate: 0,
          gst: 0,
          grandTotal: 0
        });
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://dataentry-one.vercel.app/spares/pinv/${selectedInvoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString()
        }),
      });

      if (response.ok) {
        await fetchInvoices();
        setShowEditDialog(false);
        setSelectedInvoice(null);
        setFormData({
          invoiceNo: '',
          date: new Date().toISOString().slice(0, 16),
          supplierName: '',
          itemName: '',
          quantity: 0,
          purchaseRate: 0,
          totalRate: 0,
          gst: 0,
          grandTotal: 0
        });
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Purchase Invoices</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage purchase invoices</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
          <div className="w-full sm:w-[39%]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <button 
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Table/Cards Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST %</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grand Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No invoices found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{invoice.supplierName}</td>
                    <td className="px-6 py-4">{invoice.itemName}</td>
                    <td className="px-6 py-4">{invoice.quantity}</td>
                    <td className="px-6 py-4">₹{invoice.purchaseRate.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{invoice.totalRate.toLocaleString()}</td>
                    <td className="px-6 py-4">{invoice.gst}%</td>
                    <td className="px-6 py-4">₹{invoice.grandTotal.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => invoice.id && handleDelete(invoice.id)}
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
          {filteredInvoices.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No invoices found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {invoice.invoiceNo}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => invoice.id && handleDelete(invoice.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</p>
                        <p className="text-gray-900 dark:text-white">{invoice.supplierName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Item</p>
                        <p className="text-gray-900 dark:text-white">{invoice.itemName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</p>
                        <p className="text-gray-900 dark:text-white">{invoice.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rate</p>
                        <p className="text-gray-900 dark:text-white">₹{invoice.purchaseRate.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                        <p className="text-gray-900 dark:text-white">₹{invoice.totalRate.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GST</p>
                        <p className="text-gray-900 dark:text-white">{invoice.gst}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Grand Total</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{invoice.grandTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Invoice Dialog */}
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
              <FileText className="h-6 w-6 text-green-600 dark:text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Invoice</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Rate
                  </label>
                  <input
                    type="number"
                    name="purchaseRate"
                    value={formData.purchaseRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GST %
                  </label>
                  <input
                    type="number"
                    name="gst"
                    value={formData.gst}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Rate
                  </label>
                  <input
                    type="number"
                    name="totalRate"
                    value={formData.totalRate}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grand Total
                  </label>
                  <input
                    type="number"
                    name="grandTotal"
                    value={formData.grandTotal}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
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
                  {loading ? 'Adding...' : 'Add Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedInvoice(null);
              }}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Invoice</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text- gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Rate
                  </label>
                  <input
                    type="number"
                    name="purchaseRate"
                    value={formData.purchaseRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GST %
                  </label>
                  <input
                    type="number"
                    name="gst"
                    value={formData.gst}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Rate
                  </label>
                  <input
                    type="number"
                    name="totalRate"
                    value={formData.totalRate}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grand Total
                  </label>
                  <input
                    type="number"
                    name="grandTotal"
                    value={formData.grandTotal}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedInvoice(null);
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
                  {loading ? 'Updating...' : 'Update Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;