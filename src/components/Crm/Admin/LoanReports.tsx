import React, { useState, useEffect } from 'react';
import { Download, Edit, Search, Trash2, X, FileSpreadsheet, ClipboardList, FileText, Table } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

interface Loan {
  id: number;
  customerName: string;
  fathersName: string;
  chassisNumber: string;
  modelName: string;
  color: string;
  pendingAmount: number;
  saleBy: string;
  address: string;
  phoneNo1: string;
  phoneNo2: string;
  saleDate: string;
  loanBy: string;
  amount: number;
  discount: number;
  collectedBy: string;
}

const Loan = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    fathersName: '',
    chassisNumber: '',
    modelName: '',
    color: '',
    pendingAmount: 0,
    saleBy: '',
    address: '',
    phoneNo1: '',
    phoneNo2: '',
    saleDate: '',
    loanBy: '',
    amount: 0,
    discount: 0,
    collectedBy: ''
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/loans/def');
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLoan 
        ? `https://dataentry-one.vercel.app/loans/def/${editingLoan.id}`
        : 'https://dataentry-one.vercel.app/loans/def';
      
      const date = new Date(formData.saleDate);
      date.setUTCHours(12, 0, 0, 0);
  
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        discount: Number(formData.discount),
        pendingAmount: Number(formData.pendingAmount),
        saleDate: date.toISOString()
      };
  
      const response = await fetch(url, {
        method: editingLoan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error('Failed to save loan');
      }
  
      fetchLoans();
      setShowAddDialog(false);
      setEditingLoan(null);
      setFormData({
        customerName: '',
        fathersName: '',
        chassisNumber: '',
        modelName: '',
        color: '',
        pendingAmount: 0,
        saleBy: '',
        address: '',
        phoneNo1: '',
        phoneNo2: '',
        saleDate: '',
        loanBy: '',
        amount: 0,
        discount: 0,
        collectedBy: ''
      });
    } catch (error) {
      console.error('Error saving loan:', error);
      alert('Failed to save loan. Please try again.');
    }
  };

  const handleEdit = (loan: Loan) => {
    const formattedLoan = {
      ...loan,
      saleDate: new Date(loan.saleDate).toISOString().split('T')[0]
    };
    setEditingLoan(loan);
    setFormData(formattedLoan);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/loans/def/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchLoans();
        }
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate
      ? new Date(loan.saleDate).toDateString() === selectedDate.toDateString()
      : true;

    return matchesSearch && matchesDate;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    const tableColumn = [
      "Customer Name", "Chassis Number", "Model", "Amount", "Sale Date", "Pending Amount"
    ];
    const tableRows = filteredLoans.map(loan => [
      loan.customerName,
      loan.chassisNumber,
      loan.modelName,
      `₹${loan.amount}`,
      new Date(loan.saleDate).toLocaleDateString(),
      `₹${loan.pendingAmount}`
    ]);

    doc.text("Loan Reports", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("loan-reports.pdf");
    setShowDownloadMenu(false);
  };

  const handleDownloadCSV = () => {
    const data = filteredLoans.map(loan => ({
      "Customer Name": loan.customerName,
      "Father's Name": loan.fathersName,
      "Chassis Number": loan.chassisNumber,
      "Model Name": loan.modelName,
      "Color": loan.color,
      "Pending Amount": loan.pendingAmount,
      "Sale By": loan.saleBy,
      "Address": loan.address,
      "Phone 1": loan.phoneNo1,
      "Phone 2": loan.phoneNo2,
      "Sale Date": new Date(loan.saleDate).toLocaleDateString(),
      "Loan By": loan.loanBy,
      "Amount": loan.amount,
      "Discount": loan.discount,
      "Collected By": loan.collectedBy
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'loan-reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl mb-6 md:mb-0">
              <FileSpreadsheet className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                 Reports
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                View and export loan records
              </p>
            </div>
          </div>

          {/* Action Buttons and Search - Desktop */}
          <div className="hidden md:flex justify-end items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-12 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="w-40 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholderText="Filter by Date"
                isClearable
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors md:mr-8"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                  >
                    <FileText className="h-4 w-4" />
                    Download as PDF
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    <Table className="h-4 w-4" />
                    Download as CSV
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons and Search - Mobile */}
          <div className="md:hidden flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex justify-between gap-4">
              <div className="relative flex-1">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholderText="Filter Logs"
                  isClearable
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      <FileText className="h-4 w-4" />
                      Download as PDF
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                    >
                      <Table className="h-4 w-4" />
                      Download as CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{loan.customerName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(loan.saleDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(loan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Father's Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.fathersName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Chassis Number</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Model</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.modelName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Color</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.color}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Sale By</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.saleBy}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Loan By</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.loanBy}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Phone 1</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.phoneNo1}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Phone 2</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{loan.phoneNo2}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{loan.address}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{loan.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Discount</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{loan.discount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Pending Amount</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">₹{loan.pendingAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Collected By</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{loan.collectedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[2000px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Father's Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Chassis Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Model Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Color</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Pending Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Sale By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Mobile 1st</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Mobile 2nd</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Sale Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Loan By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Collected By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No loans found
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan, index) => (
                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{loan.customerName}</td>
                      <td className="px-4 py-3 text-sm">{loan.fathersName}</td>
                      <td className="px-4 py-3 text-sm">{loan.chassisNumber}</td>
                      <td className="px-4 py-3 text-sm">{loan.modelName}</td>
                      <td className="px-4 py-3 text-sm">{loan.color}</td>
                      <td className="px-4 py-3 text-sm">₹{loan.pendingAmount}</td>
                      <td className="px-4 py-3 text-sm">{loan.saleBy}</td>
                      <td className="px-4 py-3 text-sm">{loan.address}</td>
                      <td className="px-4 py-3 text-sm">{loan.phoneNo1}</td>
                      <td className="px-4 py-3 text-sm">{loan.phoneNo2}</td>
                      <td className="px-4 py-3 text-sm">{new Date(loan.saleDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">{loan.loanBy}</td>
                      <td className="px-4 py-3 text-sm">₹{loan.amount}</td>
                      <td className="px-4 py-3 text-sm">₹{loan.discount}</td>
                      <td className="px-4 py-3 text-sm">{loan.collectedBy}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(loan)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(loan.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
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

        {/* Add/Edit Loan Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingLoan(null);
                  }}
                  className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {editingLoan ? 'Edit Loan' : 'New Loan'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Father's Name</label>
                    <input
                      type="text"
                      name="fathersName"
                      
                   
                      value={formData.fathersName}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale By</label>
                    <input
                      type="text"
                      name="saleBy"
                      value={formData.saleBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale Date</label>
                    <input
                      type="date"
                      name="saleDate"
                      value={formData.saleDate ? new Date(formData.saleDate).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan By</label>
                    <input
                      type="text"
                      name="loanBy"
                      value={formData.loanBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collected By</label>
                    <input
                      type="text"
                      name="collectedBy"
                      value={formData.collectedBy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile 1st</label>
                    <input
                      type="text"
                      name="phoneNo1"
                      value={formData.phoneNo1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile 2nd</label>
                    <input
                      type="text"
                      name="phoneNo2"
                      value={formData.phoneNo2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddDialog(false);
                        setEditingLoan(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                    >
                      {editingLoan ? 'Update Loan' : 'Save Loan'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loan;