import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for dashboard
  const attendanceData = [
    { week: 'Week 1', present: 18, absent: 2 },
    { week: 'Week 2', present: 17, absent: 3 },
    { week: 'Week 3', present: 19, absent: 1 },
    { week: 'Week 4', present: 16, absent: 4 },
  ];

  const upcomingClasses = [
    {
      id: '1',
      groupName: 'Web-01',
      trainingName: 'Web Development Fundamentals',
      date: 'Today, 10:00 AM',
      learnerCount: 18,
    },
    {
      id: '2',
      groupName: 'JS-Advanced-01',
      trainingName: 'Advanced JavaScript',
      date: 'Tomorrow, 2:00 PM',
      learnerCount: 15,
    },
    {
      id: '3',
      groupName: 'Web-01',
      trainingName: 'Web Development Fundamentals',
      date: 'May 12, 10:00 AM',
      learnerCount: 18,
    },
  ];

  const statCards = [
    {
      title: 'My Groups',
      value: '3',
      icon: <Users size={24} className="text-primary-600" />,
    },
    {
      title: 'Today\'s Sessions',
      value: '2',
      icon: <Calendar size={24} className="text-accent-600" />,
    },
    {
      title: 'Hours This Week',
      value: '12',
      icon: <Clock size={24} className="text-indigo-500" />,
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: <CheckCircle size={24} className="text-success-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name}</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-full h-fit">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2" title="Recent Attendance">
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
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#4CAF50" />
                <Bar dataKey="absent" stackId="a" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Upcoming Classes */}
        <Card title="Upcoming Classes">
          <div className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{cls.groupName}</h4>
                    <p className="text-sm text-gray-600">{cls.trainingName}</p>
                    <p className="text-xs text-gray-500 mt-1">{cls.date}</p>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1 text-gray-500" />
                    <span className="text-sm">{cls.learnerCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-start p-3 border-b last:border-b-0">
              <div className="mr-4">
                {index % 3 === 0 ? (
                  <CheckCircle className="text-green-500" />
                ) : index % 3 === 1 ? (
                  <Calendar className="text-primary-600" />
                ) : (
                  <Users className="text-indigo-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {index % 3 === 0
                    ? 'Marked attendance for Web-01'
                    : index % 3 === 1
                    ? 'Session completed'
                    : 'New learner joined your group'}
                </p>
                <p className="text-sm text-gray-500">
                  {index % 3 === 0
                    ? '18 present, 2 absent'
                    : index % 3 === 1
                    ? 'JavaScript Advanced - Functions and Closures'
                    : 'Ahmed joined JavaScript Advanced Group'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {index === 0 ? 'Just now' : index === 1 ? '2 hours ago' : 'Yesterday'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TrainerDashboard;