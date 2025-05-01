import React, { useState } from 'react';
import { Search, Calendar, Check, X, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Mock data for groups
const trainerGroups = [
  {
    id: '1',
    name: 'Web-01',
    trainingName: 'Web Development Fundamentals',
  },
  {
    id: '2',
    name: 'JS-Advanced-01',
    trainingName: 'Advanced JavaScript',
  },
  {
    id: '3',
    name: 'Web-02',
    trainingName: 'Web Development Fundamentals',
  }
];

// Mock data for learners
const groupLearners = {
  '1': [
    { id: '1', name: 'Ahmed Hassan', email: 'ahmed.h@example.com' },
    { id: '2', name: 'Sara Ahmed', email: 'sara.a@example.com' },
    { id: '3', name: 'Omar Kamal', email: 'omar.k@example.com' },
    { id: '4', name: 'Layla Mohamed', email: 'layla.m@example.com' },
    { id: '5', name: 'Tarek Ibrahim', email: 'tarek.i@example.com' },
    { id: '6', name: 'Nour Ali', email: 'nour.a@example.com' },
    { id: '7', name: 'Yara Mahmoud', email: 'yara.m@example.com' },
    { id: '8', name: 'Ziad Othman', email: 'ziad.o@example.com' },
  ],
  '2': [
    { id: '9', name: 'Mohamed Adel', email: 'mohamed.a@example.com' },
    { id: '10', name: 'Hana Samir', email: 'hana.s@example.com' },
    { id: '11', name: 'Karim Fouad', email: 'karim.f@example.com' },
    { id: '12', name: 'Dina Walid', email: 'dina.w@example.com' },
    { id: '13', name: 'Amr Hossam', email: 'amr.h@example.com' },
  ],
  '3': [
    { id: '14', name: 'Mariam Essam', email: 'mariam.e@example.com' },
    { id: '15', name: 'Khaled Ahmed', email: 'khaled.a@example.com' },
    { id: '16', name: 'Salma Ramy', email: 'salma.r@example.com' },
    { id: '17', name: 'Youssef Ali', email: 'youssef.a@example.com' },
    { id: '18', name: 'Rana Mohamed', email: 'rana.m@example.com' },
    { id: '19', name: 'Adam Ibrahim', email: 'adam.i@example.com' },
  ]
};

interface Learner {
  id: string;
  name: string;
  email: string;
}

interface AttendanceRecord {
  [learnerId: string]: boolean;
}

const TrainerAttendance: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState(trainerGroups[0].id);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const currentLearners = groupLearners[selectedGroup as keyof typeof groupLearners] || [];
  
  const filteredLearners = currentLearners.filter(learner => 
    learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    learner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const currentGroup = trainerGroups.find(group => group.id === selectedGroup);
  
  const markAttendance = (learnerId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [learnerId]: isPresent
    }));
  };
  
  const markAllPresent = () => {
    const newAttendance: AttendanceRecord = {};
    currentLearners.forEach(learner => {
      newAttendance[learner.id] = true;
    });
    setAttendance(newAttendance);
  };
  
  const handleSaveAttendance = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Here we would typically post the attendance data to the server
      console.log('Saving attendance for', currentGroup?.name, 'on', selectedDate, attendance);
      
      // Show success message or redirect
      alert('Attendance saved successfully!');
    }, 1000);
  };
  
  const isLearnerMarked = (learnerId: string) => {
    return learnerId in attendance;
  };
  
  const getMarkedCount = () => {
    return Object.keys(attendance).length;
  };
  
  const getPresentCount = () => {
    return Object.values(attendance).filter(status => status).length;
  };
  
  const getAbsentCount = () => {
    return Object.values(attendance).filter(status => !status).length;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="flex space-x-2">
          <Button 
            variant="success" 
            onClick={markAllPresent}
          >
            Mark All Present
          </Button>
          <Button 
            onClick={handleSaveAttendance}
            isLoading={isSaving}
            disabled={getMarkedCount() === 0}
            className="flex items-center space-x-1"
          >
            <Save size={16} />
            <span>Save Attendance</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="group" className="form-label">Select Group</label>
            <select
              id="group"
              className="form-input"
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setAttendance({});
              }}
            >
              {trainerGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} - {group.trainingName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="form-label">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                className="form-input pl-10"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="search" className="form-label">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search learners..."
                className="form-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
            <span className="text-sm">Present: {getPresentCount()}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-error-500 mr-2"></div>
            <span className="text-sm">Absent: {getAbsentCount()}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-sm">Not Marked: {currentLearners.length - getMarkedCount()}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500 py-2 border-b">
            <div className="col-span-4 md:col-span-5">Learner</div>
            <div className="col-span-6 md:col-span-5">Email</div>
            <div className="col-span-2">Status</div>
          </div>
          
          {filteredLearners.length > 0 ? (
            filteredLearners.map((learner: Learner) => (
              <div key={learner.id} className="grid grid-cols-12 gap-4 py-3 border-b items-center">
                <div className="col-span-4 md:col-span-5 font-medium">{learner.name}</div>
                <div className="col-span-6 md:col-span-5 text-sm text-gray-600 truncate">{learner.email}</div>
                <div className="col-span-2 flex space-x-1">
                  <button
                    className={`p-1 rounded-full ${attendance[learner.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => markAttendance(learner.id, true)}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className={`p-1 rounded-full ${isLearnerMarked(learner.id) && !attendance[learner.id] ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => markAttendance(learner.id, false)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No learners match your search criteria
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrainerAttendance;