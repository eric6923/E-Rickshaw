import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, Receipt, ClipboardList, Pencil, Trash2 } from 'lucide-react';

interface Invoice {
  id: string;
  customerName: string;
  address: string;
  phoneNumber1: string;
  hypothecation: string;
  itemName: string;
  modelName: string;
  chassisNumber: string;
  motorNumber: string;
  typeOfBattery: string;
  batterySerialNo1: string;
  batterySerialNo2: string;
  batterySerialNo3: string;
  batterySerialNo4: string;
  batterySerialNo5: string;
  color: string;
  salesValue: number;
  createdAt: string;
  updatedAt: string;
}

const SalesInvoice = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phoneNumber1: '',
    hypothecation: '',
    itemName: '',
    modelName: '',
    chassisNumber: '',
    motorNumber: '',
    typeOfBattery: '',
    batterySerialNo1: '',
    batterySerialNo2: '',
    batterySerialNo3: '',
    batterySerialNo4: '',
    batterySerialNo5: '',
    color: '',
    salesValue: ''
  });

  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/salesinv');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      address: '',
      phoneNumber1: '',
      hypothecation: '',
      itemName: '',
      modelName: '',
      chassisNumber: '',
      motorNumber: '',
      typeOfBattery: '',
      batterySerialNo1: '',
      batterySerialNo2: '',
      batterySerialNo3: '',
      batterySerialNo4: '',
      batterySerialNo5: '',
      color: '',
      salesValue: ''
    });
    setEditingInvoice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      customerName: formData.customerName,
      address: formData.address,
      phoneNumber1: formData.phoneNumber1,
      hypothecation: formData.hypothecation,
      itemName: formData.itemName,
      modelName: formData.modelName,
      chassisNumber: formData.chassisNumber,
      motorNumber: formData.motorNumber,
      typeOfBattery: formData.typeOfBattery,
      batterySerialNo1: formData.batterySerialNo1,
      batterySerialNo2: formData.batterySerialNo2,
      batterySerialNo3: formData.batterySerialNo3,
      batterySerialNo4: formData.batterySerialNo4,
      batterySerialNo5: formData.batterySerialNo5,
      color: formData.color,
      salesValue: Number(formData.salesValue)
    };

    try {
      if (editingInvoice) {
        await fetch(`https://dataentry-one.vercel.app/rickshaw/salesinv/${editingInvoice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('https://dataentry-one.vercel.app/rickshaw/salesinv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
      
      await fetchInvoices();
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      address: invoice.address,
      phoneNumber1: invoice.phoneNumber1,
      hypothecation: invoice.hypothecation,
      itemName: invoice.itemName,
      modelName: invoice.modelName,
      chassisNumber: invoice.chassisNumber,
      motorNumber: invoice.motorNumber,
      typeOfBattery: invoice.typeOfBattery,
      batterySerialNo1: invoice.batterySerialNo1,
      batterySerialNo2: invoice.batterySerialNo2,
      batterySerialNo3: invoice.batterySerialNo3,
      batterySerialNo4: invoice.batterySerialNo4,
      batterySerialNo5: invoice.batterySerialNo5,
      color: invoice.color,
      salesValue: invoice.salesValue.toString()
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await fetch(`https://dataentry-one.vercel.app/rickshaw/salesinv/${id}`, {
          method: 'DELETE',
        });
        await fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl -mt-10 sm:mt-0">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Sales Invoice
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage sales invoices and customer information
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-[39%] ml-0 sm:ml-96">
              <div className="relative ml-0 sm:ml-36">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
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
                Add Invoice
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Hypothecation</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Item Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Model Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Chassis Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Motor Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Serial 1</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Serial 2</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Serial 3</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Serial 4</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Battery Serial 5</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Color</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Sales Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="h-8 w-8 text-gray-400" />
                        <p>No invoices found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.phoneNumber1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.hypothecation}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.modelName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.chassisNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.motorNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.typeOfBattery}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.batterySerialNo1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.batterySerialNo2}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.batterySerialNo3}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.batterySerialNo4}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.batterySerialNo5}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.color}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.salesValue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
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
            {filteredInvoices.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                  <p>No invoices found</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice, index) => (
                  <div key={invoice.id} className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{invoice.customerName}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Address</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.phoneNumber1}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Hypothecation</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.hypothecation}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Item Name</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.itemName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Model Name</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.modelName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Chassis Number</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.chassisNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Motor Number</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.motorNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Battery Type</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.typeOfBattery}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Battery Serial Numbers</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {invoice.batterySerialNo1}<br />
                          {invoice.batterySerialNo2}<br />
                          {invoice.batterySerialNo3}<br />
                          {invoice.batterySerialNo4}<br />
                          {invoice.batterySerialNo5}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Color</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.color}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Sales Value</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.salesValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Invoice Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
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
                <Receipt className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingInvoice ? 'Edit Sales Invoice' : 'Add New Sales Invoice'}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber1"
                      value={formData.phoneNumber1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hypothecation</label>
                    <input
                      type="text"
                      name="hypothecation"
                      value={formData.hypothecation}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                    <input
                      type="text"
                      name="modelName"
                      value={formData.modelName}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motor Number</label>
                    <input
                      type="text"
                      name="motorNumber"
                      value={formData.motorNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Type</label>
                    <input
                      type="text"
                      name="typeOfBattery"
                      value={formData.typeOfBattery}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial 1</label>
                    <input
                      type="text"
                      name="batterySerialNo1"
                      value={formData.batterySerialNo1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial 2</label>
                    <input
                      type="text"
                      name="batterySerialNo2"
                      value={formData.batterySerialNo2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial 3</label>
                    <input
                      type="text"
                      name="batterySerialNo3"
                      value={formData.batterySerialNo3}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial 4</label>
                    <input
                      type="text"
                      name="batterySerialNo4"
                      value={formData.batterySerialNo4}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial 5</label>
                    <input
                      type="text"
                      name="batterySerialNo5"
                      value={formData.batterySerialNo5}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sales Value</label>
                    <input
                      type="number"
                      name="salesValue"
                      value={formData.salesValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
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
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingInvoice ? 'Update Invoice' : 'Add Invoice'}
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

export default SalesInvoice;