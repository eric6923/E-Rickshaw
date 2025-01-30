import React, { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Mail,
  Phone,
  MapPin,
  Link,
  Users,
  ArrowUpRight,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  profileURL: string | null;
  location: string;
  isClient: boolean;
  projects: Project[];
}

interface ApiResponse {
  message: string;
  contacts: Contact[];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  profileURL: string;
  isClient: boolean;
}

const ClientList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    profileURL: "",
    isClient: true,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        "https://totem-consultancy-beta.vercel.app/api/crm/contacts"
      );
      const data: ApiResponse = await response.json();
      const clientContacts = data.contacts.filter(
        (contact) => contact.isClient
      );
      setContacts(clientContacts);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch contacts");
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      company: contact.company || "",
      profileURL: contact.profileURL || "",
      isClient: true,
    });
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone is required";
    if (!formData.location.trim()) return "Location is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch(
        `https://totem-consultancy-beta.vercel.app/api/crm/contacts/${editingContact?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            location: formData.location.trim(),
            company: formData.company.trim(),
            profileURL: formData.profileURL.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update contact");
      }

      setSuccess("Contact updated successfully!");
      await fetchContacts();

      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contact");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    setDeleteLoading(contactId);
    try {
      const response = await fetch(
        `https://totem-consultancy-beta.vercel.app/api/crm/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete contact");
      }

      setSuccess("Contact deleted successfully!");
      fetchContacts();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setDeleteLoading("");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Clients
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage your client relationships
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="mb-8 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-500" />
            <input
              type="text"
              placeholder="Search clients by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all hover:border-gray-300 dark:hover:border-gray-600"
            />
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-200 rounded-r-xl animate-fadeIn">
            {success}
          </div>
        )}
        {error && !isOpen && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-200 rounded-r-xl animate-fadeIn">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-gray-500 dark:text-gray-400">Loading clients...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {contact.name}
                              </div>
                              {contact.profileURL && (
                                <a
                                  href={contact.profileURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 mt-2 group"
                                >
                                  <Link className="h-4 w-4" />
                                  <span className="group-hover:underline">Profile</span>
                                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              )}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 mt-2">
                                Client
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-900 dark:text-gray-300 space-y-2">
                            <div className="flex items-center gap-2 group/item">
                              <Mail className="h-4 w-4 text-black-600 group-hover/item:text-blue-500 transition-colors" />
                              <span className="group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                {contact.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <Phone className="h-4 w-4 text-green-600 group-hover/item:text-blue-500 transition-colors" />
                              <span className="group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                {contact.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm group/item">
                            <MapPin className="h-4 w-4 text-yellow-600 group-hover/item:text-blue-500 transition-colors" />
                            <span className="text-gray-900 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                              {contact.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-900 dark:text-gray-300">
                            {contact.company || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleEdit(contact)}
                              className="p-2 text-blue-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              disabled={deleteLoading === contact.id}
                              className="p-2 text-red-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 disabled:opacity-50"
                            >
                              {deleteLoading === contact.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        {contact.company && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {contact.company}
                          </p>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 mt-2">
                          Client
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="p-2 text-blue-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          disabled={deleteLoading === contact.id}
                          className="p-2 text-red-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 disabled:opacity-50"
                        >
                          {deleteLoading === contact.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm group/item">
                        <Mail className="h-4 w-4 text-black-600 group-hover/item:text-blue-500 transition-colors" />
                        <span className="text-gray-600 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                          {contact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm group/item">
                        <Phone className="h-4 w-4 text-green-600 group-hover/item:text-blue-500 transition-colors" />
                        <span className="text-gray-600 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                          {contact.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm group/item">
                        <MapPin className="h-4 w-4 text-yellow-600 group-hover/item:text-blue-500 transition-colors" />
                        <span className="text-gray-600 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                        {contact.location}
                        </span>
                      </div>
                    </div>

                    {contact.profileURL && (
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={contact.profileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-sm text-blue-500 hover:text-blue-600 group/link"
                        >
                          <span className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            <span className="group-hover/link:underline">View Profile</span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Enhanced Modal */}
        {/* Modal Form */}
{isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative my-4 sm:my-0">
      <div className="flex justify-between items-center p-4 sm:p-6 border-b">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {editingContact ? 'Edit Contact' : 'Create New Contact'}
        </h2>
        <button
          onClick={() => {
            setIsOpen(false);
            setEditingContact(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              location: '',
              company: '',
              profileURL: '',
              isClient: false
            });
          }}
          className="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile URL
            </label>
            <input
              type="url"
              name="profileURL"
              value={formData.profileURL}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="https://example.com/profile"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={formLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
        >
          {formLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {editingContact ? 'Updating Contact...' : 'Creating Contact...'}
            </>
          ) : (
            editingContact ? 'Update Contact' : 'Create Contact'
          )}
        </button>
      </form>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ClientList;