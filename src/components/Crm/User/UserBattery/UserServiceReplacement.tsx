import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, Battery, ClipboardList, FileSpreadsheet, Pencil, Trash2 } from 'lucide-react';

interface ServiceData {
  id?: number;
  oldBatteryNumber: string;
  modelName: string;
  retailerName: string;
  customerName: string;
  salesInvoiceNumber: string;
  dateOfInvoice: string;
  tokenNumber: string;
  replacementBatterySerialNo: string;
  createdAt?: string;
}

const ServiceBatteryReplacement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  
  const [formData, setFormData] = useState<ServiceData>({
    oldBatteryNumber: '',
    modelName: '',
    retailerName: '',
    customerName: '',
    salesInvoiceNumber: '',
    dateOfInvoice: '',
    tokenNumber: '',
    replacementBatterySerialNo: ''
  });

  const fetchServices = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/battery/batreplace');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
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
      oldBatteryNumber: '',
      modelName: '',
      retailerName: '',
      customerName: '',
      salesInvoiceNumber: '',
      dateOfInvoice: '',
      tokenNumber: '',
      replacementBatterySerialNo: ''
    });
    setIsEditing(false);
    setSelectedService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && selectedService?.id
        ? `https://dataentry-one.vercel.app/battery/batreplace/${selectedService.id}`
        : 'https://dataentry-one.vercel.app/battery/batreplace';

      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfInvoice: new Date(formData.dateOfInvoice).toISOString()
        }),
      });

      if (response.ok) {
        fetchServices();
        setShowAddDialog(false);
        resetForm();
      } else {
        console.error('Error saving service:', await response.text());
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: ServiceData) => {
    setIsEditing(true);
    setSelectedService(service);
    setFormData({
      oldBatteryNumber: service.oldBatteryNumber,
      modelName: service.modelName,
      retailerName: service.retailerName,
      customerName: service.customerName,
      salesInvoiceNumber: service.salesInvoiceNumber,
      dateOfInvoice: new Date(service.dateOfInvoice).toISOString().split('T')[0],
      tokenNumber: service.tokenNumber,
      replacementBatterySerialNo: service.replacementBatterySerialNo
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/battery/batreplace/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchServices();
        } else {
          console.error('Error deleting service:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const filteredServices = services.filter(service =>
    Object.values(service).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 space-y-8 max-w-[1400px]">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <FileSpreadsheet className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Battery Replacement Service</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage battery replacement records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-[39%]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
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
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Table Section (Desktop) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="hidden md:block overflow-x-auto max-h-[600px]">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Old Battery Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Model Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Retailer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Sales Invoice Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Date of Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Token Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap min-w-[150px]">Battery S/N</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No services found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="text-gray-900 dark:text-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{service.oldBatteryNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.modelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.retailerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.salesInvoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(service.dateOfInvoice).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.tokenNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{service.replacementBatterySerialNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => service.id && handleDelete(service.id)}
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
          {filteredServices.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No services found</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{service.customerName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Token #{service.tokenNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => service.id && handleDelete(service.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Old Battery Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{service.oldBatteryNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Model Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{service.modelName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Retailer Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{service.retailerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Invoice Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{service.salesInvoiceNumber}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date of Invoice</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(service.dateOfInvoice).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Replacement Battery S/N</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{service.replacementBatterySerialNo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Service Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl w-full sm:w-[600px] max-h-[90vh] overflow-y-auto relative">
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
              <Battery className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Battery Replacement' : 'Add New Battery Replacement'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Old Battery Number</label>
                  <input
                    type="text"
                    name="oldBatteryNumber"
                    value={formData.oldBatteryNumber}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Retailer Name</label>
                  <input
                    type="text"
                    name="retailerName"
                    value={formData.retailerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sales Invoice Number</label>
                  <input
                    type="text"
                    name="salesInvoiceNumber"
                    value={formData.salesInvoiceNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Invoice</label>
                  <input
                    type="date"
                    name="dateOfInvoice"
                    value={formData.dateOfInvoice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Token Number</label>
                  <input
                    type="text"
                    name="tokenNumber"
                    value={formData.tokenNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Replacement Battery Serial Number</label>
                  <input
                    type="text"
                    name="replacementBatterySerialNo"
                    value={formData.replacementBatterySerialNo}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {isEditing ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceBatteryReplacement;