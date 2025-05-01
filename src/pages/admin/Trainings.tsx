import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formationAPI } from '../../api/apiService';

interface Training {
  id: number;
  title: string;  // Changed from nom to title
  description: string;
  dateDebut: string;
  dateFin: string;
}

const Trainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<Training | null>(null);
  const [newTraining, setNewTraining] = useState({
    title: '',  // Changed from nom to title
    description: '',
    dateDebut: '',
    dateFin: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await formationAPI.getAll();

      console.log('API Response:', response);

      // Handle Spring Boot HATEOAS response format
      if (response.data && response.data._embedded) {
        // Extracting data from Spring Boot HATEOAS format
        // HATEOAS response has collections in _embedded object
        const embeddedData = response.data._embedded;
        console.log('_embedded data:', embeddedData);

        // Find the trainings collection by looking for common collection names
        const possibleCollectionNames = [
          'trainings', 'formations', 'trainingList', 'formationList',
          'trainingEntities', 'formationEntities', 'formationDtoList'
        ];

        let trainingsCollection = null;
        for (const key of Object.keys(embeddedData)) {
          console.log(`Found collection key: ${key}`);
          if (possibleCollectionNames.includes(key) ||
            Array.isArray(embeddedData[key])) {
            trainingsCollection = embeddedData[key];
            break;
          }
        }

        if (trainingsCollection) {
          console.log('Found trainings collection:', trainingsCollection);
          setTrainings(trainingsCollection);
        } else {
          // If no specific collection was found, but there's only one key
          // in _embedded, use that as the collection
          const embeddedKeys = Object.keys(embeddedData);
          if (embeddedKeys.length === 1 && Array.isArray(embeddedData[embeddedKeys[0]])) {
            console.log(`Using _embedded.${embeddedKeys[0]} as trainings collection`);
            setTrainings(embeddedData[embeddedKeys[0]]);
          } else {
            console.error('Could not identify trainings collection in _embedded:', embeddedData);
            setTrainings([]);
            setError('Could not identify trainings data in server response');
          }
        }
      } else if (Array.isArray(response.data)) {
        console.log('Data is a simple array with length:', response.data.length);
        setTrainings(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // Handle other object formats
        console.log('Data is an object with keys:', Object.keys(response.data));

        // Try common API response structures
        const trainingsArray =
          Array.isArray(response.data.content) ? response.data.content :
            Array.isArray(response.data.data) ? response.data.data :
              response.data.trainings ? response.data.trainings :
                response.data.formations ? response.data.formations : [];

        if (trainingsArray.length > 0) {
          console.log('Extracted trainings array with length:', trainingsArray.length);
          setTrainings(trainingsArray);
        } else if (response.data.id) {
          // The response might be a single training object
          console.log('Found a single training object');
          setTrainings([response.data]);
        } else {
          console.error('Could not extract trainings array from response:', response.data);
          setTrainings([]);
          setError('Could not parse training data from server');
        }
      } else {
        console.error('Unexpected response format:', response.data);
        setTrainings([]);
        setError('Unexpected data format received from server');
      }
    } catch (error) {
      console.error('Failed to fetch trainings:', error);
      setTrainings([]);
      setError('Failed to load trainings from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const openCreateModal = () => {
    setNewTraining({ title: '', description: '', dateDebut: '', dateFin: '' });
    setCurrentTraining(null);
    setIsModalOpen(true);
  };

  const openEditModal = (training: Training) => {
    setNewTraining({
      title: training.title || '',
      description: training.description || '',
      dateDebut: training.dateDebut || '',
      dateFin: training.dateFin || '',
    });
    setCurrentTraining(training);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newTraining.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      console.log('Submitting training data:', newTraining);

      if (currentTraining) {
        const response = await formationAPI.update(currentTraining.id.toString(), newTraining);
        console.log('Update response:', response);
      } else {
        const response = await formationAPI.create(newTraining);
        console.log('Create response:', response);
      }

      setIsModalOpen(false);

      // Clear form
      setNewTraining({ title: '', description: '', dateDebut: '', dateFin: '' });

      // Reload trainings
      await fetchTrainings();
    } catch (error) {
      console.error('Error saving training:', error);
      alert('Error saving training. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await formationAPI.delete(id.toString());

        // Update local state immediately for better UX
        setTrainings(trainings.filter(t => t.id !== id));

        // Then fetch fresh data from server
        fetchTrainings();
      } catch (error) {
        console.error('Error deleting training:', error);
        alert('Error deleting training. Please try again.');
      }
    }
  };

  // Make sure trainings is an array before filtering
  const filteredTrainings = Array.isArray(trainings)
    ? trainings.filter(training =>
      (training.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    : [];

  // Debug rendering  
  console.log('Rendering with trainings:', trainings);
  console.log('Filtered trainings:', filteredTrainings);

  const columns = [
    {
      Header: 'Title',
      accessor: 'title' as keyof Training,  // Changed from nom to title
      Cell: ({ value, row }: any) => value || 'Untitled'
    },
    {
      Header: 'Description',
      accessor: 'description' as keyof Training,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'Start Date',
      accessor: 'dateDebut' as keyof Training,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'End Date',
      accessor: 'dateFin' as keyof Training,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'Actions',
      Cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => openEditModal(row.original)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.original.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Training Courses</h1>
        <Button onClick={openCreateModal} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Training</span>
        </Button>
      </div>

      <div className="flex mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search training..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Debug info - remove in production */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Debug view of the raw data - remove in production */}
      {!loading && trainings.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <details>
            <summary className="cursor-pointer font-semibold">Debug: Raw Data Structure</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(trainings[0], null, 2)}
            </pre>
          </details>
        </div>
      )}

      <Card>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading trainings...</p>
        ) : filteredTrainings.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No trainings found</p>
        ) : (
          <DataTable<Training> columns={columns} data={filteredTrainings} />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTraining ? 'Edit Training' : 'Add Training'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="trainingForm">
              {currentTraining ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="trainingForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"  // Changed from nom to title
            value={newTraining.title}
            onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
            required
          />
          <Input
            label="Description"
            name="description"
            value={newTraining.description}
            onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
            required
          />
          <Input
            label="Start Date"
            type="date"
            name="dateDebut"
            value={newTraining.dateDebut}
            onChange={(e) => setNewTraining({ ...newTraining, dateDebut: e.target.value })}
            required
          />
          <Input
            label="End Date"
            type="date"
            name="dateFin"
            value={newTraining.dateFin}
            onChange={(e) => setNewTraining({ ...newTraining, dateFin: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default Trainings;