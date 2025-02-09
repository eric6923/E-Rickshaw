import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, FileText, Eye, Pencil, Trash2 } from 'lucide-react';

interface DocumentData {
  id?: string;
  customerName: string;
  aadharCard: string;
  panCard: string;
  homeLocation: string;
  voterIdOrDL: string;
  salesInvoiceWithDS: string;
  batterySaleInvoice: string;
  salesCertificateWithDS: string;
  insurance: string;
  livePhoto: string;
  signaturePhoto: string;
  createdAt?: string;
  updatedAt?: string;
}

const Documents = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentRecords, setDocumentRecords] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DocumentData | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof DocumentData) => {
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
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/document');
      const data = await response.json();
      setDocumentRecords(data);
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
      [name as keyof DocumentData]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRecords();
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
      } else {
        console.error('Failed to create record');
      }
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const handleEdit = (record: DocumentData) => {
    setSelectedRecord(record);
    setFormData(record);
    setShowEditDialog(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord?.id) return;

    try {
      const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/document/${selectedRecord.id}`, {
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
      } else {
        console.error('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/document/${id}`, {
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

  const FileUploadField = ({ label, name, value }: { label: string; name: keyof DocumentData; value: string }) => (
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
          {value ? 'Change File' : 'Choose File'}
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

  const filteredRecords = documentRecords.filter(record =>
    Object.values(record).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const DialogForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => Promise<void>, title: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => {
            setShowAddDialog(false);
            setShowEditDialog(false);
            setSelectedRecord(null);
          }}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
        </div>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhar Card</label>
              <input
                type="text"
                name="aadharCard"
                value={formData.aadharCard}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pan Card</label>
              <input
                type="text"
                name="panCard"
                value={formData.panCard}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Location</label>
              <input
                type="text"
                name="homeLocation"
                value={formData.homeLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Voter's ID/DL</label>
              <input
                type="text"
                name="voterIdOrDL"
                value={formData.voterIdOrDL}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <FileUploadField
              label="Sales Invoice with DS"
              name="salesInvoiceWithDS"
              value={formData.salesInvoiceWithDS}
            />
            <FileUploadField
              label="Battery Sale Invoice"
              name="batterySaleInvoice"
              value={formData.batterySaleInvoice}
            />
            <FileUploadField
              label="Sales Certificate with DS"
              name="salesCertificateWithDS"
              value={formData.salesCertificateWithDS}
            />
            <FileUploadField
              label="Insurance"
              name="insurance"
              value={formData.insurance}
            />
            <FileUploadField
              label="Live Photo"
              name="livePhoto"
              value={formData.livePhoto}
            />
            <FileUploadField
              label="Signature Photo"
              name="signaturePhoto"
              value={formData.signaturePhoto}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                setSelectedRecord(null);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              {showEditDialog ? 'Update Record' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const MobileCard = ({ record }: { record: DocumentData }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{record.customerName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Location: {record.homeLocation}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => record.id && handleDelete(record.id)}
            className="p-2 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aadhar Card</p>
          <p className="text-sm text-gray-900 dark:text-white">{record.aadharCard}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pan Card</p>
          <p className="text-sm text-gray-900 dark:text-white">{record.panCard}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Voter's ID/DL</p>
          <p className="text-sm text-gray-900 dark:text-white">{record.voterIdOrDL}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Sales Invoice', value: record.salesInvoiceWithDS },
          { label: 'Battery Invoice', value: record.batterySaleInvoice },
          { label: 'Sales Certificate', value: record.salesCertificateWithDS },
          { label: 'Insurance', value: record.insurance },
          { label: 'Live Photo', value: record.livePhoto },
          { label: 'Signature Photo', value: record.signaturePhoto }
        ].map((item, index) => (
          item.value && (
            <div key={index} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
              <button
                onClick={() => handleImageView(item.value)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 space-y-8 max-w-[1400px]">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Documents</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage document records</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
  <div className="w-full sm:w-[39%] ml-auto">
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
  <div className="w-full sm:w-auto flex justify-end mr-0 sm:mr-44">
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

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aadhar Card</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Pan Card</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Home Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Voter's ID/DL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Sales Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Battery Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Sales Certificate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Insurance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Live Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Signature Photo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[275px]">Actions</th>
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
                      <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4 whitespace-nowrap">{record.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.aadharCard}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.panCard}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.homeLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.voterIdOrDL}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.salesInvoiceWithDS && (
                        <button
                          onClick={() => handleImageView(record.salesInvoiceWithDS)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.batterySaleInvoice && (
                        <button
                          onClick={() => handleImageView(record.batterySaleInvoice)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.salesCertificateWithDS && (
                        <button
                          onClick={() => handleImageView(record.salesCertificateWithDS)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.insurance && (
                        <button
                          onClick={() => handleImageView(record.insurance)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.livePhoto && (
                        <button
                          onClick={() => handleImageView(record.livePhoto)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.signaturePhoto && (
                        <button
                          onClick={() => handleImageView(record.signaturePhoto)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => record.id && handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              <p>No records found</p>
            </div>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <MobileCard key={record.id} record={record} />
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      {(showAddDialog || showEditDialog) && (
        <DialogForm
          onSubmit={showEditDialog ? handleUpdate : handleSubmit}
          title={showEditDialog ? 'Edit Document Record' : 'Add New Document Record'}
        />
      )}
    </div>
  );
};

export default Documents;