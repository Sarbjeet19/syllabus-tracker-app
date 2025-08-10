import { useState } from 'react';

export default function AddSubjectForm({ onSubjectAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Subject name cannot be empty.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/progress/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add subject.');
      }
      onSubjectAdded(data);
      setName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add a New Subject</h2>
      <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Operating Systems"
          className="flex-grow px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary px-6 py-2 text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors duration-300"
        >
          Add Subject
        </button>
      </form>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </div>
  );
}