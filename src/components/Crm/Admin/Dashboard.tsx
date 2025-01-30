import React from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  BadgeDollarSign,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Sample data - replace with actual data
const chartData = [
  { name: 'Jan', pending: 4000, paid: 2400, amt: 2400 },
  { name: 'Feb', pending: 3000, paid: 1398, amt: 2210 },
  { name: 'Mar', pending: 2000, paid: 9800, amt: 2290 },
  { name: 'Apr', pending: 2780, paid: 3908, amt: 2000 },
  { name: 'May', pending: 1890, paid: 4800, amt: 2181 },
  { name: 'Jun', pending: 2390, paid: 3800, amt: 2500 },
];

const transactions = [
  { id: 1, name: 'John Doe', discount: 100, paidAmount: 2500, status: 'Completed' },
  { id: 2, name: 'Jane Smith', discount: 150, paidAmount: 3000, status: 'Processing' },
  { id: 3, name: 'Mike Johnson', discount: 200, paidAmount: 4500, status: 'Completed' },
];

const defaulters = [
  { id: 1, name: 'Alice Brown', chassisNumber: 'CH123456', pendingAmount: 5000, daysOverdue: 15 },
  { id: 2, name: 'Bob Wilson', chassisNumber: 'CH789012', pendingAmount: 3500, daysOverdue: 30 },
  { id: 3, name: 'Carol Davis', chassisNumber: 'CH345678', pendingAmount: 2800, daysOverdue: 7 },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your financial metrics and performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Amount"
            amount="₹45,000"
            icon={<Clock className="h-6 w-6" />}
            trend="up"
            percentage="12.5"
            color="text-yellow-600 dark:text-yellow-400"
            bgColor="bg-yellow-50 dark:bg-yellow-900/20"
          />
          <StatCard
            title="Paid Amount"
            amount="₹32,000"
            icon={<CheckCircle2 className="h-6 w-6" />}
            trend="up"
            percentage="8.2"
            color="text-green-600 dark:text-green-400"
            bgColor="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            title="Discount"
            amount="₹3,500"
            icon={<BadgeDollarSign className="h-6 w-6" />}
            trend="down"
            percentage="4.1"
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            title="Defaulters"
            amount="12"
            icon={<AlertTriangle className="h-6 w-6" />}
            trend="up"
            percentage="2.5"
            color="text-red-600 dark:text-red-400"
            bgColor="bg-red-50 dark:bg-red-900/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Pending Loan"
            amount="₹125,000"
            icon={<Clock className="h-6 w-6" />}
            trend="up"
            percentage="15.2"
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-purple-50 dark:bg-purple-900/20"
          />
          <StatCard
            title="Approved Loan"
            amount="₹250,000"
            icon={<CheckCircle2 className="h-6 w-6" />}
            trend="up"
            percentage="18.5"
            color="text-green-600 dark:text-green-400"
            bgColor="bg-green-50 dark:bg-green-900/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Pending Loan Amount"
            amount="₹75,000"
            icon={<Wallet className="h-6 w-6" />}
            trend="down"
            percentage="5.8"
            color="text-orange-600 dark:text-orange-400"
            bgColor="bg-orange-50 dark:bg-orange-900/20"
          />
          <StatCard
            title="Paid Loan Amount"
            amount="₹180,000"
            icon={<DollarSign className="h-6 w-6" />}
            trend="up"
            percentage="22.4"
            color="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          />
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Payment Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly payment analysis</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Paid</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: '0.75rem' }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.875rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#f59e0b" 
                  fillOpacity={1}
                  fill="url(#colorPending)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="paid" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorPaid)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions and Defaulters Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Month Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Current Month Transactions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overview of recent transactions</p>
                </div>
                <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">S No</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Full Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid Amount</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction, index) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.name}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{transaction.discount}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">₹{transaction.paidAmount}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Current Month Defaulters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Current Month Defaulters</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">List of payment defaulters</p>
                </div>
                <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">S No</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Full Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chassis Number</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Days Overdue</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pending Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {defaulters.map((defaulter, index) => (
                        <tr key={defaulter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{defaulter.name}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{defaulter.chassisNumber}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              defaulter.daysOverdue > 20 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : defaulter.daysOverdue > 10
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                            }`}>
                              {defaulter.daysOverdue} days
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">₹{defaulter.pendingAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  amount: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  percentage: string;
  color: string;
  bgColor: string;
}

function StatCard({ title, amount, icon, trend, percentage, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg transition-colors duration-300`}>
          <span className={`${color} transition-colors duration-300`}>{icon}</span>
        </div>
        <span className={`flex items-center gap-1 text-sm px-2.5 py-1 rounded-full ${
          trend === 'up' 
            ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
            : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {percentage}%
        </span>
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{amount}</p>
    </div>
  );
}

export default App;