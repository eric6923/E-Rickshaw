import React, { useState, useEffect } from "react";
import { 
  Pencil, 
  Trash2, 
  Briefcase, 
  Plus, 
  Clock, 
  CheckCircle, 
  PauseCircle,
  Building2,
  Mail,
  Calendar 
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  profileURL: string | null;
  location: string;
  isClient: boolean;
}

interface Project {
  id: string;
  name: string;
  desc: string;
  status: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
  contact: Contact;
  tasks: any[];
}

interface ProjectFormData {
  name: string;
  desc: string;
  status: string;
  contactId: string;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    desc: "",
    status: "inProgress",
    contactId: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchContacts();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "https://totem-consultancy-beta.vercel.app/api/crm/projects"
      );
      const data = await response.json();
      setProjects(data.projectts || []); // Note: API response uses "projectts"
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        "https://totem-consultancy-beta.vercel.app/api/crm/contacts"
      );
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        name: project.name,
        desc: project.desc,
        status: project.status,
        contactId: project.contactId,
      });
    } else {
      setSelectedProject(null);
      setFormData({
        name: "",
        desc: "",
        status: "inProgress",
        contactId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = selectedProject
        ? `https://totem-consultancy-beta.vercel.app/api/crm/projects/${selectedProject.id}`
        : "https://totem-consultancy-beta.vercel.app/api/crm/projects";

      const response = await fetch(url, {
        method: selectedProject ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        fetchProjects();
        handleCloseModal();
      }
    } catch (error) {
      setMessage("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const response = await fetch(
        `https://totem-consultancy-beta.vercel.app/api/crm/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchProjects();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inProgress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "onHold":
        return <PauseCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Manage your project portfolio
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="min-w-full">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:table w-full">
            <div className="bg-gray-50 dark:bg-gray-700">
              <div className="grid grid-cols-6 px-6 py-3">
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </div>
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </div>
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </div>
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </div>
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </div>
                <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <div
                key={project.id}
                className="sm:grid sm:grid-cols-6 p-4 sm:px-6 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Modified Mobile View */}
                <div className="sm:hidden space-y-4">
                  {/* Header with Name and Actions */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {project.desc}
                      </div>
                      <span
                        className={`mt-2 px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full 
                        ${
                          project.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : project.status === "inProgress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                      <Building2 className="h-4 w-4 text-orange-600" />
                      {project.contact.name}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4" />
                      {project.contact.email}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-green-600" />
                      {formatDate(project.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Desktop View - Grid layout */}
                <div className="hidden sm:block font-medium text-sm">{project.name}</div>
                <div className="hidden sm:block text-gray-500 text-sm">{project.desc}</div>
                <div className="hidden sm:block">
                  <span
                    className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full 
                    ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : project.status === "inProgress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {getStatusIcon(project.status)}
                    {project.status}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                      <Building2 className="h-4 w-4 text-orange-600" />
                      {project.contact.name}
                    </div>
                    <div className="flex items-center gap-1 text-black-600 dark:text-white-600">
                      <Mail className="h-4 w-4" />
                      {project.contact.email}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 text-green-600" />
                  {formatDate(project.createdAt)}
                </div>
                <div className="hidden sm:flex space-x-3">
                  <button
                    onClick={() => handleOpenModal(project)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedProject ? "Edit Project" : "Add Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="onHold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact
                </label>
                <select
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.email})
                    </option>
                  ))}
                </select>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md ${
                    message.includes("Error")
                      ? "bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200"
                      : "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {loading
                    ? "Processing..."
                    : selectedProject
                    ? "Update Project"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Delete Project
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete "{selectedProject.name}"?
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProject.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
