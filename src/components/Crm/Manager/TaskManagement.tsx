import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, User, Users, ClipboardList } from "lucide-react";

interface Project {
  id: string;
  name: string;
  desc: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  designation: string;
  email: string;
}

interface Task {
  id: string;
  name: string;
  desc: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    status: string;
  };
  assignedManager: {
    id: string;
    name: string;
    designation: string;
  };
  assignedTeammember: {
    id: string;
    name: string;
    designation: string;
  };
}

interface TaskFormData {
  name: string;
  desc: string;
  projectId: string;
  assignedManagerId: string;
  assignedTeammemberId: string;
}

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    name: "",
    desc: "",
    projectId: "",
    assignedManagerId: "",
    assignedTeammemberId: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchFormData();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://totem-consultancy-beta.vercel.app/api/crm/tasks"
      );
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchFormData = async () => {
    try {
      const [projectsRes, managersRes, teamMembersRes] = await Promise.all([
        fetch("https://totem-consultancy-beta.vercel.app/api/crm/projects"),
        fetch(
          "https://totem-consultancy-beta.vercel.app/api/crm/users?role=manager"
        ),
        fetch(
          "https://totem-consultancy-beta.vercel.app/api/crm/users?role=teammember"
        ),
      ]);

      const projectsData = await projectsRes.json();
      const managersData = await managersRes.json();
      const teamMembersData = await teamMembersRes.json();

      setProjects(projectsData.projectts || []);
      setManagers(managersData.users || []);
      setTeamMembers(teamMembersData.users || []);
    } catch (err) {
      console.error("Error fetching form data:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://totem-consultancy-beta.vercel.app/api/crm/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setIsModalOpen(false);
      setFormData({
        name: "",
        desc: "",
        projectId: "",
        assignedManagerId: "",
        assignedTeammemberId: "",
      });
      fetchTasks(); // Refresh tasks list
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        {/* Header Section */}
<div className="flex flex-col gap-6 mb-6">
  <div className="flex items-center gap-4">
    <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-xl">
      <ClipboardList className="h-8 w-8 text-white" />
    </div>
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Tasks
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Manage your project tasks
      </p>
    </div>
  </div>
  <div className="flex justify-end">
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Task
    </button>
  </div>
</div>
  
        {/* Tasks Grid */}
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1
                        ${
                          task.project.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                            : task.project.status === "inProgress"
                            ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {task.project.name}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.createdAt)}
                    </div>
                    {task.isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-xs font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
  
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.assignedManager.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignedManager.designation}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.assignedTeammember.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignedTeammember.designation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create New Task
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
  
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg flex items-center gap-2">
                    <span className="text-sm">{error}</span>
                  </div>
                )}
  
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Task Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter task name"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Project
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        value={formData.projectId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            projectId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Description
                      </label>
                      <textarea
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors h-24 resize-none"
                        value={formData.desc}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            desc: e.target.value,
                          }))
                        }
                        placeholder="Enter task description"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Assigned Manager
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        value={formData.assignedManagerId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedManagerId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select a manager</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name} - {manager.designation}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Assigned Team Member
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        value={formData.assignedTeammemberId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedTeammemberId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select a team member</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {member.designation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
  
                  <div className="flex justify-end items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200
                        ${
                          loading
                            ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
                            : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        }`}
                    >
                      {loading ? "Creating..." : "Create Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default TaskManagementPage