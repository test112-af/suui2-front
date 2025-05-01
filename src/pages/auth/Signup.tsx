import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',   // ✅ backend expects this
    confirmPassword: '',
    role: 'TRAINER'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nom || !formData.email || !formData.motDePasse) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.motDePasse !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...rest } = formData;
      const dataToSend = {
        ...rest,
        role: rest.role.toLowerCase(), // ✅ convert "ADMIN" → "admin", "TRAINER" → "trainer"
      };

      const response = await axios.post('http://localhost:8080/api/auth/signup', dataToSend);

      const userData = {
        id: response.data.user?.id,
        name: response.data.user?.name || response.data.user?.nom,
        email: response.data.user?.email,
        role: (response.data.user?.role || '').replace('ROLE_', '') // 🔥 clean up role
      };

      const sessionData = {
        user: userData,
        token: response.data.token,
        expiry: Date.now() + (24 * 60 * 60 * 1000)
      };

      localStorage.setItem('tweadup_user', JSON.stringify(sessionData));

      navigate(userData.role === 'ADMIN' ? '/admin' : '/trainer');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Account</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Name" required className="form-input" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="form-input" />
          <input type="password" name="motDePasse" value={formData.motDePasse} onChange={handleChange} placeholder="Password" required className="form-input" />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="form-input" />
          <select name="role" value={formData.role} onChange={handleChange} className="form-input">
            <option value="TRAINER">Trainer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white rounded py-2" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
