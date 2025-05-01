import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Edit, Trash2, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { apprenantAPI, groupeAPI } from '../../api/apiService';

interface Learner {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  status: string;
  dateInscription: string;
  groupe?: { id: number; nom: string };
}

interface Group {
  id: number;
  nom: string;
  name?: string; // Support both field names from API
}

const Learners: React.FC = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentLearner, setCurrentLearner] = useState<Learner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newLearner, setNewLearner] = useState({
    nom: '',
    email: '',
    telephone: '',
    status: '',
    dateInscription: '',
    groupeId: '',
  });

  const fetchLearners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apprenantAPI.getAll();
      console.log('API Response for learners:', response);

      let learnersData: any[] = [];

      // Handle Spring Boot HATEOAS response format
      if (response?.data?._embedded) {
        // Extract from _embedded (HATEOAS format)
        const embeddedData = response.data._embedded;
        console.log('_embedded data:', embeddedData);

        // Try to find the learners collection
        const possibleCollectionNames = [
          'apprenants', 'learners', 'apprenantList', 'learnerList',
          'apprenantEntities', 'learnerEntities', 'apprenantDtoList'
        ];

        let learnersCollection = null;
        for (const key of Object.keys(embeddedData)) {
          console.log(`Found collection key: ${key}`);
          if (possibleCollectionNames.includes(key) ||
            Array.isArray(embeddedData[key])) {
            learnersCollection = embeddedData[key];
            break;
          }
        }

        if (learnersCollection) {
          console.log('Found learners collection:', learnersCollection);
          learnersData = learnersCollection;
        } else {
          // If no specific collection was found, but there's only one key
          // in _embedded, use that as the collection
          const embeddedKeys = Object.keys(embeddedData);
          if (embeddedKeys.length === 1 && Array.isArray(embeddedData[embeddedKeys[0]])) {
            console.log(`Using _embedded.${embeddedKeys[0]} as learners collection`);
            learnersData = embeddedData[embeddedKeys[0]];
          } else {
            console.error('Could not identify learners collection in _embedded:', embeddedData);
            setError('Could not identify learners data in server response');
          }
        }
      } else if (Array.isArray(response?.data)) {
        console.log('Data is a simple array with length:', response.data.length);
        learnersData = response.data;
      } else if (response?.data && typeof response?.data === 'object') {
        // Handle other object formats
        console.log('Data is an object with keys:', Object.keys(response.data));

        // Try common API response structures
        const learnersArray =
          Array.isArray(response.data.content) ? response.data.content :
            Array.isArray(response.data.data) ? response.data.data :
              response.data.apprenants ? response.data.apprenants :
                response.data.learners ? response.data.learners : [];

        if (learnersArray.length > 0) {
          console.log('Extracted learners array with length:', learnersArray.length);
          learnersData = learnersArray;
        } else if (response.data.id) {
          // The response might be a single learner object
          console.log('Found a single learner object');
          learnersData = [response.data];
        } else {
          console.error('Could not extract learners array from response:', response.data);
          setError('Could not parse learner data from server');
        }
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected data format received from server');
      }

      // Process each learner to ensure consistent structure
      const processedLearners = learnersData.map((item: any) => ({
        id: item.id,
        nom: item.nom || item.name || 'Unnamed',
        email: item.email || '-',
        telephone: item.telephone || item.phone || '-',
        status: item.status || item.statut || 'Unknown',
        dateInscription: item.dateInscription || item.joinDate || item.registrationDate || '-',
        groupe: item.groupe || item.group || null
      }));

      setLearners(processedLearners);
    } catch (error: unknown) {
      console.error('Failed to fetch learners:', error);
      setError('Failed to load learners from server');
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        if ('response' in error) {
          console.error('Error details:', {
            status: (error as any).response?.status,
            data: (error as any).response?.data,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupeAPI.getAll();
      console.log('API Response for groups:', response);

      let groupsData: any[] = [];

      // Handle Spring Boot HATEOAS response format
      if (response?.data?._embedded) {
        const embeddedData = response.data._embedded;
        const possibleGroupKeys = ['groupes', 'groups', 'groupList'];

        let groupCollection = null;
        for (const key of Object.keys(embeddedData)) {
          if (possibleGroupKeys.includes(key) || Array.isArray(embeddedData[key])) {
            groupCollection = embeddedData[key];
            break;
          }
        }

        if (groupCollection) {
          groupsData = groupCollection;
        } else {
          // If no specific key, use the first array found
          const embeddedKeys = Object.keys(embeddedData);
          if (embeddedKeys.length === 1 && Array.isArray(embeddedData[embeddedKeys[0]])) {
            groupsData = embeddedData[embeddedKeys[0]];
          }
        }
      } else if (Array.isArray(response?.data)) {
        groupsData = response.data;
      } else if (response?.data && typeof response?.data === 'object') {
        // Try common API structures
        const groupsArray =
          Array.isArray(response.data.content) ? response.data.content :
            Array.isArray(response.data.data) ? response.data.data :
              response.data.groupes ? response.data.groupes :
                response.data.groups ? response.data.groups : [];

        if (groupsArray.length > 0) {
          groupsData = groupsArray;
        } else if (response.data.id) {
          groupsData = [response.data];
        }
      }

      // Process each group to ensure consistent structure
      const processedGroups = groupsData.map((item: any) => ({
        id: item.id,
        nom: item.nom || item.name || 'Unnamed Group'
      }));

      setGroups(processedGroups);
    } catch (error: unknown) {
      console.error('Failed to fetch groups:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchLearners();
    fetchGroups();
  }, []);

  const openCreateModal = () => {
    setNewLearner({
      nom: '', email: '', telephone: '', status: '',
      dateInscription: '', groupeId: ''
    });
    setCurrentLearner(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (learner: Learner) => {
    setNewLearner({
      nom: learner.nom,
      email: learner.email,
      telephone: learner.telephone,
      status: learner.status,
      dateInscription: learner.dateInscription,
      groupeId: learner.groupe?.id.toString() || '',
    });
    setCurrentLearner(learner);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newLearner.nom.trim()) {
      alert('Name is required');
      return;
    }

    try {
      console.log('Submitting learner data:', newLearner);

      const payload = {
        ...newLearner,
        groupeId: newLearner.groupeId ? parseInt(newLearner.groupeId) : null,
      };

      if (isEdit && currentLearner) {
        const response = await apprenantAPI.update(currentLearner.id.toString(), payload);
        console.log('Update response:', response);
      } else {
        const response = await apprenantAPI.create(payload);
        console.log('Create response:', response);
      }

      setIsModalOpen(false);

      // Clear form
      setNewLearner({
        nom: '', email: '', telephone: '', status: '',
        dateInscription: '', groupeId: ''
      });

      // Reload learners
      fetchLearners();
    } catch (error: unknown) {
      console.error('Error saving learner:', error);
      alert('Error saving learner. Please try again.');
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this learner?')) {
      try {
        await apprenantAPI.delete(id.toString());

        // Update local state immediately for better UX
        setLearners(learners.filter(l => l.id !== id));

        // Then fetch fresh data from server
        fetchLearners();
      } catch (error: unknown) {
        console.error('Error deleting learner:', error);
        alert('Error deleting learner. Please try again.');
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
    }
  };

  // Make sure learners is an array before filtering
  const filteredLearners = Array.isArray(learners)
    ? learners.filter(learner =>
      (learner.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (learner.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    : [];

  // Debug rendering
  console.log('Rendering with learners:', learners);
  console.log('Filtered learners:', filteredLearners);

  const columns = [
    {
      Header: 'Name', accessor: 'nom' as keyof Learner,
      Cell: ({ value }: any) => value || 'Unnamed'
    },
    {
      Header: 'Email', accessor: 'email' as keyof Learner,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'Phone', accessor: 'telephone' as keyof Learner,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'Group',
      accessor: (row: Learner) => row.groupe?.nom || '-',
    },
    {
      Header: 'Status', accessor: 'status' as keyof Learner,
      Cell: ({ value }: any) => value || '-'
    },
    {
      Header: 'Join Date', accessor: 'dateInscription' as keyof Learner,
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
        <h1 className="text-2xl font-semibold">Learners Management</h1>
        <Button onClick={openCreateModal} className="flex items-center space-x-2">
          <UserPlus size={20} />
          <span>Add Learner</span>
        </Button>
      </div>

      <div className="flex mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search learners..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Debug view of the raw data - remove in production */}
      {!loading && learners.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <details>
            <summary className="cursor-pointer font-semibold">Debug: Raw Learner Data Structure</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(learners[0], null, 2)}
            </pre>
          </details>
        </div>
      )}

      <Card>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading learners...</p>
        ) : filteredLearners.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No learners found</p>
        ) : (
          <DataTable<Learner> columns={columns} data={filteredLearners} />
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? 'Edit Learner' : 'Add Learner'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="learnerForm">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="learnerForm" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="nom"
            value={newLearner.nom}
            onChange={(e) => setNewLearner({ ...newLearner, nom: e.target.value })}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={newLearner.email}
            onChange={(e) => setNewLearner({ ...newLearner, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            name="telephone"
            value={newLearner.telephone}
            onChange={(e) => setNewLearner({ ...newLearner, telephone: e.target.value })}
            required
          />
          <Input
            label="Join Date"
            type="date"
            name="dateInscription"
            value={newLearner.dateInscription}
            onChange={(e) => setNewLearner({ ...newLearner, dateInscription: e.target.value })}
            required
          />
          <Input
            label="Status"
            name="status"
            value={newLearner.status}
            onChange={(e) => setNewLearner({ ...newLearner, status: e.target.value })}
            required
          />
          <div>
            <label htmlFor="groupeId" className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              id="groupeId"
              name="groupeId"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newLearner.groupeId}
              onChange={(e) => setNewLearner({ ...newLearner, groupeId: e.target.value })}
              required
            >
              <option value="">Select Group</option>
              {groups.map((groupe) => (
                <option key={groupe.id} value={groupe.id}>
                  {groupe.nom}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Learners;