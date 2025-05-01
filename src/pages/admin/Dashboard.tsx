import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Layers, AlertTriangle, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const attendanceData = [
    { month: 'Jan', present: 85, absent: 15 },
    { month: 'Feb', present: 80, absent: 20 },
    { month: 'Mar', present: 90, absent: 10 },
    { month: 'Apr', present: 75, absent: 25 },
    { month: 'May', present: 88, absent: 12 },
    { month: 'Jun', present: 92, absent: 8 },
  ];

  const paymentData = [
    { name: 'Paid', value: 85 },
    { name: 'Unpaid', value: 15 },
  ];

  const COLORS = ['#4CAF50', '#F44336'];

  const statCards = [
    {
      title: 'Total Learners',
      value: '132',
      icon: <Users size={24} className="text-primary-600" />,
      change: '+12% from last month',
      positive: true,
    },
    {
      title: 'Active Trainings',
      value: '8',
      icon: <BookOpen size={24} className="text-accent-600" />,
      change: '+2 from last month',
      positive: true,
    },
    {
      title: 'Active Groups',
      value: '15',
      icon: <Layers size={24} className="text-indigo-500" />,
      change: 'Same as last month',
      positive: true,
    },
    {
      title: 'Unpaid Payments',
      value: '23',
      icon: <AlertTriangle size={24} className="text-error-500" />,
      change: '-5 from last month',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full h-fit">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Attendance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Monthly Attendance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#4CAF50" />
                <Bar dataKey="absent" stackId="a" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Payment Status */}
        <Card title="Payment Status">
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Paid</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Unpaid</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="flex items-start p-3 border-b last:border-b-0">
              <div className="mr-4">
                {index % 4 === 0 ? (
                  <Users className="text-primary-600" />
                ) : index % 4 === 1 ? (
                  <DollarSign className="text-green-500" />
                ) : index % 4 === 2 ? (
                  <Layers className="text-indigo-500" />
                ) : (
                  <AlertTriangle className="text-amber-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {index % 4 === 0
                    ? 'New learner registered'
                    : index % 4 === 1
                    ? 'Payment received'
                    : index % 4 === 2
                    ? 'New group created'
                    : 'Attendance marked'}
                </p>
                <p className="text-sm text-gray-500">
                  {index % 4 === 0
                    ? 'Ahmed joined JavaScript Advanced Group'
                    : index % 4 === 1
                    ? 'Maria paid $150 for Web Development course'
                    : index % 4 === 2
                    ? 'New Python Beginners group created'
                    : 'John marked attendance for UI/UX Design group'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {index === 0 ? 'Just now' : index === 1 ? '2 hours ago' : index === 2 ? 'Yesterday' : '2 days ago'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;