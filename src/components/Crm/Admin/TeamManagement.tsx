import React, { useState, useEffect } from 'react';
import { Download, Plus, Search, X, Users, Mail, UserCog, UserPlus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Permission {
  id: number;
  userId: number;
  canManageERickshaw: boolean;
  canManageBattery: boolean;
  canManageSparesServices: boolean;
  canManageLoan: boolean;
  canManageAttendance: boolean;
  canManageDashboard: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  permissions: Permission[];
}

interface FormData {
  name: string;
  email: string;
  role: string;
  password: string;
  permissions: {
    canManageERickshaw: boolean;
    canManageBattery: boolean;
    canManageSparesServices: boolean;
    canManageLoan: boolean;
    canManageAttendance: boolean;
    canManageDashboard: boolean;
  };
}

function UserTeam() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    password: '',
    permissions: {
      canManageERickshaw: false,
      canManageBattery: false,
      canManageSparesServices: false,
      canManageLoan: false,
      canManageAttendance: false,
      canManageDashboard: false
    }
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('https://dataentry-one.vercel.app/auth/admin/user');
      setTeamMembers(response.data);
    } catch (err) {
      setError('Failed to fetch team members');
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission: keyof FormData['permissions']) => {
    setFormData(prevState => ({
      ...prevState,
      permissions: {
        ...prevState.permissions,
        [permission]: !prevState.permissions[permission]
      }
    }));
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      password: '',
      permissions: member.permissions[0] || {
        canManageERickshaw: false,
        canManageBattery: false,
        canManageSparesServices: false,
        canManageLoan: false,
        canManageAttendance: false,
        canManageDashboard: false
      }
    });
    setShowEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await axios.delete(`https://dataentry-one.vercel.app/auth/admin/user/${id}`);
        await fetchTeamMembers();
      } catch (err) {
        setError('Failed to delete team member');
        console.error(err);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setLoading(true);
    setError('');

    try {
      await axios.put(`https://dataentry-one.vercel.app/auth/admin/user/${selectedMember.id}`, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions
      });
      await fetchTeamMembers();
      setShowEditDialog(false);
      setSelectedMember(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        password: '',
        permissions: {
          canManageERickshaw: false,
          canManageBattery: false,
          canManageSparesServices: false,
          canManageLoan: false,
          canManageAttendance: false,
          canManageDashboard: false
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('https://dataentry-one.vercel.app/auth/user/register', formData);
      await fetchTeamMembers();
      setShowAddDialog(false);
      setFormData({
        name: '',
        email: '',
        role: '',
        password: '',
        permissions: {
          canManageERickshaw: false,
          canManageBattery: false,
          canManageSparesServices: false,
          canManageLoan: false,
          canManageAttendance: false,
          canManageDashboard: false
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  const permissionsList = [
    { key: 'canManageERickshaw', label: 'E-Rickshaw Management' },
    { key: 'canManageBattery', label: 'Battery Management' },
    { key: 'canManageSparesServices', label: 'Spares & Services' },
    { key: 'canManageLoan', label: 'Loan Management' },
    { key: 'canManageAttendance', label: 'Attendance Management' },
    { key: 'canManageDashboard', label: 'Dashboard Access' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl -mt-12 sm:mt-0">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Team Management
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage your team members and their roles
              </p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto justify-end">
              <button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Table Section (Desktop) */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">E-Rickshaw</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Battery</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Spares</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Loan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dashboard</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <p>No team members found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member, index) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageERickshaw ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageBattery ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageSparesServices ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageLoan ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageAttendance ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {member.permissions[0]?.canManageDashboard ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="text-red-600 hover:text-red-800"
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
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {teamMembers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">No team members found</p>
              </div>
            </div>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium text-gray-900 dark:text-white">{member.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {permissionsList.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">{label}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {member.permissions[0]?.[key as keyof Permission] ? 'Yes' : 'No'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Team Member Dialog */}
        {(showAddDialog || showEditDialog) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                  setSelectedMember(null);
                  setFormData({
                    name: '',
                    email: '',
                    role: '',
                    password: '',
                    permissions: {
                      canManageERickshaw: false,
                      canManageBattery: false,
                      canManageSparesServices: false,
                      canManageLoan: false,
                      canManageAttendance: false,
                      canManageDashboard: false
                    }
                  });
                }}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <UserCog className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {showEditDialog ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
              </div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={showEditDialog ? handleUpdate : handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 transition-all"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 transition-all"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 transition-all"
                      required
                    >
                      <option value="">Select a role</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  {!showEditDialog && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 transition-all"
                        placeholder="Enter password"
                        required={!showEditDialog}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Permissions
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {permissionsList.map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-3">
                          <select
                            value={formData.permissions[key as keyof FormData['permissions']] ? 'yes' : 'no'}
                            onChange={() => handlePermissionChange(key as keyof FormData['permissions'])}
                            className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-100 transition-all"
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddDialog(false);
                      setShowEditDialog(false);
                      setSelectedMember(null);
                      setFormData({
                        name: '',
                        email: '',
                        role: '',
                        password: '',
                        permissions: {
                          canManageERickshaw: false,
                          canManageBattery: false,
                          canManageSparesServices: false,
                          canManageLoan: false,
                          canManageAttendance: false,
                          canManageDashboard: false
                        }
                      });
                    }}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (showEditDialog ? 'Updating...' : 'Creating...') : (showEditDialog ? 'Update Member' : 'Add Member')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserTeam;
