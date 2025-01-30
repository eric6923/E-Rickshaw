import {
  Users,
  Contact,
  FolderKanban,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalClients: number;
  totalContacts: number;
  totalProjects: number;
}

interface MonthlyStats {
  name: string;
  clients: number;
  contacts: number;
  projects: number;
  tasksCreated: number;
  tasksCompleted: number;
  tasksPending: number;
}

const TASK_COLORS = ['#6366F1', '#22C55E', '#EF4444'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs sm:text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard(): JSX.Element {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalContacts: 0,
    totalProjects: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monthlyData: MonthlyStats[] = [
    { name: 'Jan', clients: 30, contacts: 45, projects: 12, tasksCreated: 65, tasksCompleted: 55, tasksPending: 10 },
    { name: 'Feb', clients: 35, contacts: 52, projects: 15, tasksCreated: 75, tasksCompleted: 60, tasksPending: 15 },
    { name: 'Mar', clients: 42, contacts: 61, projects: 18, tasksCreated: 85, tasksCompleted: 70, tasksPending: 15 },
    { name: 'Apr', clients: 48, contacts: 70, projects: 22, tasksCreated: 95, tasksCompleted: 80, tasksPending: 15 },
    { name: 'May', clients: 52, contacts: 78, projects: 25, tasksCreated: 105, tasksCompleted: 90, tasksPending: 15 },
    { name: 'Jun', clients: 58, contacts: 85, projects: 28, tasksCreated: 115, tasksCompleted: 95, tasksPending: 20 },
  ];

  // Calculate latest task statistics for pie chart
  const latestMonth = monthlyData[monthlyData.length - 1];
  const taskPieData = [
    { name: 'Created', value: latestMonth.tasksCreated },
    { name: 'Completed', value: latestMonth.tasksCompleted },
    { name: 'Pending', value: latestMonth.tasksPending },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Replace these with actual API calls
        const clientsResponse = await fetch('/api/clients');
        const contactsResponse = await fetch('/api/contacts');
        const projectsResponse = await fetch('/api/projects');
        
        if (!clientsResponse.ok || !contactsResponse.ok || !projectsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [clientsData, contactsData, projectsData] = await Promise.all([
          clientsResponse.json(),
          contactsResponse.json(),
          projectsResponse.json(),
        ]);

        setStats({
          totalClients: clientsData.length,
          totalContacts: contactsData.length,
          totalProjects: projectsData.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, bgColor }: { title: string; value: number; icon: JSX.Element; bgColor: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-6 ${bgColor} rounded-xl`}>
          {icon}
        </div>
        <div className="ml-6">
          <h3 className="text-3xl xl:text-4xl font-bold text-gray-800 dark:text-white">
            {isLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : error ? (
              <span className="text-black-500">0</span>
            ) : (
              value
            )}
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            {title}
          </p>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {`${pld.name}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium" style={{ color: payload[0].payload.fill }}>
            {`${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
      <div className="h-[300px] sm:h-[400px] lg:h-80 w-full">
        {children}
      </div>
    </div>
  );

  return (
    <main className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              CRM Dashboard
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-blue-600">Overview</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8 mb-6 sm:mb-8">
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<Users className="h-12 w-12 text-blue-600" />}
            bgColor="bg-blue-100 dark:bg-blue-900"
          />
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={<Contact className="h-12 w-12 text-yellow-600" />}
            bgColor="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<FolderKanban className="h-12 w-12 text-green-600" />}
            bgColor="bg-green-100 dark:bg-green-900"
          />
        </div>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Growth Metrics */}
          <ChartContainer title="Growth Metrics">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={"preserveStartEnd"}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                  iconSize={8}
                  iconType="circle"
                />
                <Line type="monotone" dataKey="clients" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} name="Clients" />
                <Line type="monotone" dataKey="contacts" stroke="#EAB308" strokeWidth={2} dot={{ r: 2 }} name="Contacts" />
                <Line type="monotone" dataKey="projects" stroke="#22C55E" strokeWidth={2} dot={{ r: 2 }} name="Projects" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Task Status Pie Chart */}
          <ChartContainer title="Task Status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={95}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieChartTooltip />} />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </main>
  );
}