import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, Battery, ClipboardList, Receipt, Pencil, Trash2 } from 'lucide-react';

interface SalesInvoice {
  id?: number;
  customerName: string;
  address: string;
  phoneNumber1: string;
  eRickshawName: string;
  chassisNumber: string;
  itemName: string;
  modelName: string;
  serialNumber: string;
  salesValue: number;
  createdAt?: string;
}

const SalesInvoice = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState<SalesInvoice[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesInvoice | null>(null);
  
  const [formData, setFormData] = useState<SalesInvoice>({
    customerName: '',
    address: '',
    phoneNumber1: '',
    eRickshawName: '',
    chassisNumber: '',
    itemName: '',
    modelName: '',
    serialNumber: '',
    salesValue: 0
  });

  const fetchSales = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/battery/salesinv');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'salesValue' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      address: '',
      phoneNumber1: '',
      eRickshawName: '',
      chassisNumber: '',
      itemName: '',
      modelName: '',
      serialNumber: '',
      salesValue: 0
    });
    setIsEditing(false);
    setSelectedSale(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && selectedSale?.id
        ? `https://dataentry-one.vercel.app/battery/salesinv/${selectedSale.id}`
        : 'https://dataentry-one.vercel.app/battery/salesinv';

      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSales();
        setShowAddDialog(false);
        resetForm();
      } else {
        console.error('Error saving sale:', await response.text());
      }
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleEdit = (sale: SalesInvoice) => {
    setIsEditing(true);
    setSelectedSale(sale);
    setFormData({
      customerName: sale.customerName,
      address: sale.address,
      phoneNumber1: sale.phoneNumber1,
      eRickshawName: sale.eRickshawName,
      chassisNumber: sale.chassisNumber,
      itemName: sale.itemName,
      modelName: sale.modelName,
      serialNumber: sale.serialNumber,
      salesValue: sale.salesValue
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/battery/salesinv/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSales();
        } else {
          console.error('Error deleting sale:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const filteredSales = sales.filter(sale =>
    Object.values(sale).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 space-y-8 max-w-[1400px]">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 -mt-10 sm:mt-0 dark:bg-blue-500 p-3 rounded-xl">
            <Receipt className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sales Invoice</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage battery sales records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-[39%]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto justify-end">
            
            <button 
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Sale
            </button>
          </div>
        </div>
      </div>

      {/* Table Section (Desktop) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Phone Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">E-Rickshaw Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Chassis Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Model Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Serial Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[150px]">Sales Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No sales found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4 whitespace-nowrap">{sale.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.phoneNumber1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.eRickshawName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.chassisNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.modelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{sale.salesValue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => sale.id && handleDelete(sale.id)}
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

        {/* Mobile View (Cards) */}
        <div className="md:hidden">
          {filteredSales.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No sales found</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sale.customerName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{sale.phoneNumber1}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => sale.id && handleDelete(sale.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">E-Rickshaw</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.eRickshawName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Chassis Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.chassisNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Item Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.itemName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Model Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.modelName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Serial Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{sale.serialNumber}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Sales Value</span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ₹{sale.salesValue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Sale Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl w-full sm:w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Battery className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Sale' : 'Add New Sale'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber1"
                    value={formData.phoneNumber1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-Rickshaw Name</label>
                  <input
                    type="text"
                    name="eRickshawName"
                    value={formData.eRickshawName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chassis Number</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sales Value</label>
                  <input
                    type="number"
                    step="0.01"
                    name="salesValue"
                    value={formData.salesValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  {isEditing ? 'Update Sale' : 'Add Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;