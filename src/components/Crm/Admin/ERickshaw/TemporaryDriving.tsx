import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, FileText, ClipboardList, CarFront } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [drivingRecords, setDrivingRecords] = useState<TemporaryDrivingData[]>([]);
  const [loading, setLoading] = useState(false);
  
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

  const filteredRecords = drivingRecords.filter(record => 
    Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <CarFront className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Temporary Driving</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage temporary driving records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
  <div className="w-full sm:w-[39%] min-h-[50px]"> {/* Add min-height */}
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        placeholder="Search records..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  </div>
  <div className="flex gap-4 min-h-[50px]"> {/* Add min-height */}
    <button className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors">
      <Download className="h-5 w-5" />
      Download
    </button>
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

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
    <table className="w-full min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Chassis Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Driver Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Driver Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Home Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Aadhar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">PAN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Signature</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverPhoto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverAadhar}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverPan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverSignaturePhoto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.driverAmount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Photo URL</label>
                  <input
                    type="text"
                    name="driverPhoto"
                    value={formData.driverPhoto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Aadhar</label>
                  <input
                    type="text"
                    name="driverAadhar"
                    value={formData.driverAadhar}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver PAN</label>
                  <input
                    type="text"
                    name="driverPan"
                    value={formData.driverPan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver Signature Photo URL</label>
                  <input
                    type="text"
                    name="driverSignaturePhoto"
                    value={formData.driverSignaturePhoto}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
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
    </div>
  );
};

export default TemporaryDriving;