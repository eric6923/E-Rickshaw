import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, FileText, ClipboardList, CarFront, Eye, Pencil, Trash2 } from 'lucide-react';

interface TemporaryDrivingData {
  id?: string;
  modelName: string;
  chassisNumber: string;
  customerName: string;
  driverName: string;
  driverPhoneNo: string;
  driverHomeLocation: string;
  driverAddress: string;
  driverPhoto: string;
  driverAadhar: string;
  driverPan: string;
  driverSignaturePhoto: string;
  driverAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

const TemporaryDriving = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [drivingRecords, setDrivingRecords] = useState<TemporaryDrivingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TemporaryDrivingData | null>(null);
  
  const [formData, setFormData] = useState<TemporaryDrivingData>({
    modelName: '',
    chassisNumber: '',
    customerName: '',
    driverName: '',
    driverPhoneNo: '',
    driverHomeLocation: '',
    driverAddress: '',
    driverPhoto: '',
    driverAadhar: '',
    driverPan: '',
    driverSignaturePhoto: '',
    driverAmount: 0
  });

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'E-Rickshaw');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dm8jxispy/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: imageUrl
        }));
      }
    }
  };

  const handleImageView = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/tempdrive');
      const data = await response.json();
      setDrivingRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'driverAmount' ? Number(value) : value
    }));
  };

  const handleEdit = (record: TemporaryDrivingData) => {
    setSelectedRecord(record);
    setFormData(record);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/tempdrive/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchRecords();
        } else {
          console.error('Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/tempdrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchRecords();
        setShowAddDialog(false);
        setFormData({
          modelName: '',
          chassisNumber: '',
          customerName: '',
          driverName: '',
          driverPhoneNo: '',
          driverHomeLocation: '',
          driverAddress: '',
          driverPhoto: '',
          driverAadhar: '',
          driverPan: '',
          driverSignaturePhoto: '',
          driverAmount: 0
        });
      } else {
        console.error('Failed to create record');
      }
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord?.id) return;

    try {
      const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/tempdrive/${selectedRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRecords();
        setShowEditDialog(false);
        setSelectedRecord(null);
        setFormData({
          modelName: '',
          chassisNumber: '',
          customerName: '',
          driverName: '',
          driverPhoneNo: '',
          driverHomeLocation: '',
          driverAddress: '',
          driverPhoto: '',
          driverAadhar: '',
          driverPan: '',
          driverSignaturePhoto: '',
          driverAmount: 0
        });
      } else {
        console.error('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const FileUploadField = ({ label, name, value }: { label: string; name: string; value: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, name)}
          className="hidden"
          id={`file-${name}`}
          accept="image/*"
        />
        <label
          htmlFor={`file-${name}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Choose File
        </label>
        {value && (
          <button
            type="button"
            onClick={() => handleImageView(value)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
        )}
      </div>
      {value && <p className="mt-1 text-sm text-gray-500 truncate">{value}</p>}
    </div>
  );

  const filteredRecords = drivingRecords.filter(record => 
    Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const ImageViewButton = ({ url }: { url: string }) => (
    url ? (
      <button
        onClick={() => handleImageView(url)}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <Eye className="h-4 w-4" />
        View
      </button>
    ) : null
  );

  return (
    <div className="container mx-auto px-4 space-y-8 max-w-[1400px]">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
        <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl -mt-12 sm:mt-0">
            <CarFront className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white ">Temporary Driving</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage temporary driving records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 md:mr-44">
  <div className="w-full sm:w-[39%]">
    <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            {/* <button className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              <Download className="h-5 w-5" />
              Download
            </button> */}
            <button 
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Table/Cards Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Model Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Chassis Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Driver Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Driver Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Home Location</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aadhar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PAN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Signature</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[270px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4 whitespace-nowrap">{record.modelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.chassisNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverPhoneNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverHomeLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ImageViewButton url={record.driverPhoto} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ImageViewButton url={record.driverAadhar} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ImageViewButton url={record.driverPan} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ImageViewButton url={record.driverSignaturePhoto} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{record.driverAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => record.id && handleDelete(record.id)}
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
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No records found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {record.modelName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {record.chassisNumber}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => record.id && handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="text-gray-900 dark:text-white">{record.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver</p>
                        <p className="text-gray-900 dark:text-white">{record.driverName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{record.driverPhoneNo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-white">{record.driverHomeLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-gray-900 dark:text-white">{record.driverAddress}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          ₹{record.driverAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Documents</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Photo</p>
                          <ImageViewButton url={record.driverPhoto} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Aadhar</p>
                          <ImageViewButton url={record.driverAadhar} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">PAN</p>
                          <ImageViewButton url={record.driverPan} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Signature</p>
                          <ImageViewButton url={record.driverSignaturePhoto} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Record Dialog */}
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
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Driving Record</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chassis Number</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    name="driverPhoneNo"
                    value={formData.driverPhoneNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Home Location</label>
                  <input
                    type="text"
                    name="driverHomeLocation"
                    value={formData.driverHomeLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Address</label>
                  <input
                    type="text"
                    name="driverAddress"
                    value={formData.driverAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <FileUploadField
                  label="Driver Photo"
                  name="driverPhoto"
                  value={formData.driverPhoto}
                />
                <FileUploadField
                  label="Driver Aadhar"
                  name="driverAadhar"
                  value={formData.driverAadhar}
                />
                <FileUploadField
                  label="Driver PAN"
                  name="driverPan"
                  value={formData.driverPan}
                />
                <FileUploadField
                  label="Driver Signature"
                  name="driverSignaturePhoto"
                  value={formData.driverSignaturePhoto}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Amount</label>
                  <input
                    type="number"
                    name="driverAmount"
                    value={formData.driverAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
         </div>
      )}

      {/* Edit Record Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedRecord(null);
              }}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Driving Record</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Chassis Number</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Phone Number</label>
                  <input
                    type="text"
                    name="driverPhoneNo"
                    value={formData.driverPhoneNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Home Location</label>
                  <input
                    type="text"
                    name="driverHomeLocation"
                    value={formData.driverHomeLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Address</label>
                  <input
                    type="text"
                    name="driverAddress"
                    value={formData.driverAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <FileUploadField
                  label="Driver Photo"
                  name="driverPhoto"
                  value={formData.driverPhoto}
                />
                <FileUploadField
                  label="Driver Aadhar"
                  name="driverAadhar"
                  value={formData.driverAadhar}
                />
                <FileUploadField
                  label="Driver PAN"
                  name="driverPan"
                  value={formData.driverPan}
                />
                <FileUploadField
                  label="Driver Signature"
                  name="driverSignaturePhoto"
                  value={formData.driverSignaturePhoto}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Amount</label>
                  <input
                    type="number"
                    name="driverAmount"
                    value={formData.driverAmount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedRecord(null);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryDriving;