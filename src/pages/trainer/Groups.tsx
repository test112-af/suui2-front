import React from 'react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import { Column } from 'react-table';

// Define a type for the group data
interface Group {
  name: string;
  type: string;
  schedule: string;
  studentCount: number;
  status: string;
}

const TrainerGroups: React.FC = () => {
  // Correctly type the columns for react-table with specific accessors
  const columns = React.useMemo<Column<Group>[]>(
    () => [
      {
        Header: 'Group Name',
        accessor: 'name',
      },
      {
        Header: 'Training Type',
        accessor: 'type',
      },
      {
        Header: 'Schedule',
        accessor: 'schedule',
      },
      {
        Header: 'Students',
        accessor: 'studentCount',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }: { value: string }) => (
          <span 
            className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${value.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}
            `}
          >
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const data: Group[] = React.useMemo(
    () => [
      {
        name: 'Morning Batch A',
        type: 'Web Development',
        schedule: 'Mon-Wed 9:00-11:00',
        studentCount: 15,
        status: 'Active',
      },
      {
        name: 'Evening Batch B',
        type: 'Mobile Development',
        schedule: 'Tue-Thu 18:00-20:00',
        studentCount: 12,
        status: 'Active',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Groups</h1>
      
      <Card>
        <DataTable<Group>
          columns={columns}
          data={data}
          initialPageSize={5}
        />
      </Card>
    </div>
  );
};

export default TrainerGroups;