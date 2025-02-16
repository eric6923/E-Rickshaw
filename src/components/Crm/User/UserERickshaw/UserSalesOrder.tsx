import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, ClipboardList, ShoppingCart, Pencil, Trash2 } from 'lucide-react';

interface SalesOrder {
  id: string;
  deliveryDate: string;
  bookingNo: string;
  customerName: string;
  address: string;
  phoneNumber1: string;
  phoneNumber2: string;
  mothersName: string;
  fathersName: string;
  nomineeName: string;
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
  downPayment: number;
  salesmanName: string;
  agentName: string;
  financerName: string;
  financeBy: string;
}

const SalesOrder = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextBookingNo, setNextBookingNo] = useState(1);
  
  const [formData, setFormData] = useState({
    deliveryDate: '',
    bookingNo: '1',
    customerName: '',
    address: '',
    phoneNumber1: '',
    phoneNumber2: '',
    mothersName: '',
    fathersName: '',
    nomineeName: '',
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
    salesValue: '',
    downPayment: '',
    salesmanName: '',
    agentName: '',
    financerName: '',
    financeBy: ''
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dataentry-one.vercel.app/rickshaw/salesorder');
      const data = await response.json();
      
      // Sort orders by bookingNo to find the highest number
      const sortedOrders = [...data].sort((a, b) => parseInt(b.bookingNo) - parseInt(a.bookingNo));
      const highestBookingNo = sortedOrders.length > 0 ? parseInt(sortedOrders[0].bookingNo) : 0;
      setNextBookingNo(highestBookingNo + 1);
      
      // Sort orders by bookingNo for display
      const orderedData = data.sort((a: SalesOrder, b: SalesOrder) => 
        parseInt(a.bookingNo) - parseInt(b.bookingNo)
      );
      setOrders(orderedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      const url = editingOrder 
        ? `https://dataentry-one.vercel.app/rickshaw/salesorder/${editingOrder.id}`
        : 'https://dataentry-one.vercel.app/rickshaw/salesorder';
      
      const method = editingOrder ? 'PUT' : 'POST';
      
      const formattedData = {
        ...formData,
        deliveryDate: new Date(formData.deliveryDate).toISOString(),
        salesValue: parseFloat(formData.salesValue),
        downPayment: parseFloat(formData.downPayment),
        bookingNo: editingOrder ? formData.bookingNo : nextBookingNo.toString()
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        await fetchOrders();
        setShowAddDialog(false);
        setFormData({
          deliveryDate: '',
          bookingNo: nextBookingNo.toString(),
          customerName: '',
          address: '',
          phoneNumber1: '',
          phoneNumber2: '',
          mothersName: '',
          fathersName: '',
          nomineeName: '',
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
          salesValue: '',
          downPayment: '',
          salesmanName: '',
          agentName: '',
          financerName: '',
          financeBy: ''
        });
        setEditingOrder(null);
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleEdit = (order: SalesOrder) => {
    setEditingOrder(order);
    setFormData({
      deliveryDate: order.deliveryDate.split('T')[0],
      bookingNo: order.bookingNo,
      customerName: order.customerName,
      address: order.address,
      phoneNumber1: order.phoneNumber1,
      phoneNumber2: order.phoneNumber2,
      mothersName: order.mothersName,
      fathersName: order.fathersName,
      nomineeName: order.nomineeName,
      itemName: order.itemName,
      modelName: order.modelName,
      chassisNumber: order.chassisNumber,
      motorNumber: order.motorNumber,
      typeOfBattery: order.typeOfBattery,
      batterySerialNo1: order.batterySerialNo1,
      batterySerialNo2: order.batterySerialNo2,
      batterySerialNo3: order.batterySerialNo3,
      batterySerialNo4: order.batterySerialNo4,
      batterySerialNo5: order.batterySerialNo5,
      color: order.color,
      salesValue: order.salesValue.toString(),
      downPayment: order.downPayment.toString(),
      salesmanName: order.salesmanName,
      agentName: order.agentName,
      financerName: order.financerName,
      financeBy: order.financeBy
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/rickshaw/salesorder/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchOrders();
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MobileCard = ({ order }: { order: SalesOrder }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Booking #{order.bookingNo}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(order)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(order.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer Details</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm font-medium">{order.customerName}</p>
            <p className="text-sm">{order.address}</p>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm">Ph: {order.phoneNumber1}</p>
              {order.phoneNumber2 && <p className="text-sm">Alt: {order.phoneNumber2}</p>}
              
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Family Details</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm">Mother: {order.mothersName}</p>
            <p className="text-sm">Father: {order.fathersName}</p>
            <p className="text-sm">Nominee: {order.nomineeName}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Details</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm">{order.itemName} - {order.modelName}</p>
            <p className="text-sm">Chassis: {order.chassisNumber}</p>
            <p className="text-sm">Motor: {order.motorNumber}</p>
            <p className="text-sm">Color: {order.color}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Battery Details</p>
          <p className="text-sm font-medium mt-1">Type: {order.typeOfBattery}</p>
          <div className="grid grid-cols-3 gap-1 mt-1">
            <p className="text-xs">{order.batterySerialNo1}</p>
            <p className="text-xs">{order.batterySerialNo2}</p>
            <p className="text-xs">{order.batterySerialNo3}</p>
            <p className="text-xs">{order.batterySerialNo4}</p>
            <p className="text-xs">{order.batterySerialNo5}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Details</p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Sales Value</p>
              <p className="text-sm font-medium">₹{order.salesValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Down Payment</p>
              <p className="text-sm font-medium">₹{order.downPayment.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sales Details</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm">Salesman: {order.salesmanName}</p>
            <p className="text-sm">Agent: {order.agentName}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Date</p>
          <p className="text-sm font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl -mt-10 sm:mt-0">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Sales Orders
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage your sales orders and customer information
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 md:mr-10">
            <div className="w-full sm:w-[39%]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full justify-end sm:w-auto">
              <button 
                onClick={() => {
                  setEditingOrder(null);
                  setFormData({
                    deliveryDate: '',
                    bookingNo: nextBookingNo.toString(),
                    customerName: '',
                    address: '',
                    phoneNumber1: '',
                    phoneNumber2: '',
                    mothersName: '',
                    fathersName: '',
                    nomineeName: '',
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
                    salesValue: '',
                    downPayment: '',
                    salesmanName: '',
                    agentName: '',
                    financerName: '',
                    financeBy: ''
                  });
                  setShowAddDialog(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Order
              </button>
            </div>
          </div>
        </div>

        {/* Table/Cards Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
                <p>No orders found</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden p-4">
                {filteredOrders.map((order) => (
                  <MobileCard key={order.id} order={order} />
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block max-w-full overflow-x-auto">
                <table className="w-full min-w-[2000px]">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Booking No</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Delivery Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Customer Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Phone 1</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Phone 2</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Mother's Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Father's Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Nominee Name</th>
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Down Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Salesman Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Agent Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-gray-100">{order.bookingNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.phoneNumber1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.phoneNumber2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.mothersName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.fathersName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.nomineeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.modelName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.chassisNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.motorNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.typeOfBattery}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.batterySerialNo1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.batterySerialNo2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.batterySerialNo3}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.batterySerialNo4}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.batterySerialNo5}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.color}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.salesValue.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.downPayment.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.salesmanName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{order.agentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(order)}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Order Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => setShowAddDialog(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingOrder ? 'Edit Sales Order' : 'Add New Sales Order'}
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booking No</label>
                    <input
                      type="text"
                      name="bookingNo"
                      value={editingOrder ? formData.bookingNo : nextBookingNo}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number 1</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number 2</label>
                    <input
                      type="tel"
                      name="phoneNumber2"
                      value={formData.phoneNumber2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      name="mothersName"
                      value={formData.mothersName}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominee Name</label>
                    <input
                      type="text"
                      name="nomineeName"
                      value={formData.nomineeName}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial No 1</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial No 2</label>
                    <input
                      type="text"
                      name="batterySerialNo2"
                      value={formData.batterySerialNo2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial No 3</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial No 4</label>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battery Serial No 5</label>
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
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Down Payment</label>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salesman Name</label>
                    <input
                      type="text"
                      name="salesmanName"
                      value={formData.salesmanName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Name</label>
                    <input
                      type="text"
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddDialog(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingOrder ? 'Update Order' : 'Add Order'}
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

export default SalesOrder;