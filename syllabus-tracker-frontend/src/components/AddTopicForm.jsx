import { useState } from 'react';

export default function AddTopicForm({ subjectId, onTopicAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAddTopic = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/progress/subjects/${subjectId}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add topic.');
      }
      onTopicAdded(data);
      setName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleAddTopic} className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a new topic..."
        className="flex-grow px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        className="bg-primary px-4 py-2 text-sm text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors duration-300"
      >
        Add
      </button>
      {error && <p className="text-red-500 text-xs mt-1 w-full col-span-2">{error}</p>}
    </form>
  );
}