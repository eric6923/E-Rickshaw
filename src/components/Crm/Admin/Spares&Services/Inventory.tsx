import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, X, ClipboardList, Pencil, Trash2 } from 'lucide-react';

interface InventoryItem {
  id?: number;
  itemName: string;
  cost: number;
  mrp: number;
  createdAt?: string;
}

function App() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [formData, setFormData] = useState<InventoryItem>({
    itemName: '',
    cost: 0,
    mrp: 0
  });

  const fetchInventory = async () => {
    try {
      const response = await fetch('https://dataentry-one.vercel.app/spares/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData(item);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`https://dataentry-one.vercel.app/spares/inventory/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchInventory();
        } else {
          console.error('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://dataentry-one.vercel.app/spares/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchInventory();
        setShowAddDialog(false);
        setFormData({
          itemName: '',
          cost: 0,
          mrp: 0
        });
      }
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://dataentry-one.vercel.app/spares/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchInventory();
        setShowEditDialog(false);
        setSelectedItem(null);
        setFormData({
          itemName: '',
          cost: 0,
          mrp: 0
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Inventory</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage spare parts inventory</p>
          </div>
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
          <div className="w-full sm:w-[39%]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search inventory..."
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
              Add Item
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">MRP</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <p>No items found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="text-gray-900 dark:text-gray-300">
                    <td className="px-6 py-4">{item.itemName}</td>
                    <td className="px-6 py-4">₹{item.cost.toLocaleString()}</td>
                    <td className="px-6 py-4">₹{item.mrp.toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt!).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
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
          {filteredInventory.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p>No items found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.itemName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost</p>
                      <p className="text-gray-900 dark:text-white">₹{item.cost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MRP</p>
                      <p className="text-gray-900 dark:text-white">₹{item.mrp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Dialog */}
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
              <Package className="h-6 w-6 text-green-600 dark:text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Item</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
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
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    MRP
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
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
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowEditDialog(false);
                setSelectedItem(null);
              }}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Item</h2>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 gap-4">
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
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    MRP
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedItem(null);
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
                  {loading ? 'Updating...' : 'Update Item'}
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