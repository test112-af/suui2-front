import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import { paiementAPI } from '../../api/apiService';
import { Search } from 'lucide-react';
import Input from '../../components/ui/Input';

interface Payment {
  id: number;
  montant: number;
  date: string;
  statut: string;
  apprenant: { nom: string };
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paiementAPI.getAll();
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = Array.isArray(payments)
    ? payments.filter(p =>
      (p.apprenant?.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    : [];

  const columns = [
    { Header: 'Amount', accessor: 'montant' as keyof Payment },
    { Header: 'Date', accessor: 'date' as keyof Payment },
    { Header: 'Status', accessor: 'statut' as keyof Payment },
    {
      Header: 'Learner',
      accessor: (row: Payment) => row.apprenant?.nom,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payments</h1>

      <div className="flex mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search learner..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading payments...</p>
        ) : (
          <DataTable<Payment> columns={columns} data={filteredPayments} />
        )}
      </Card>
    </div>
  );
};

export default Payments;
