import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSubjectForm from '../components/AddSubjectForm.jsx';
import AddTopicForm from '../components/AddTopicForm.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function DashboardPage() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const response = await fetch('http://localhost:5000/api/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        if (!response.ok) throw new Error('Could not fetch data.');
        const data = await response.json();
        setSubjects(data.subjects);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      }
    };
    fetchProgress();
  }, [navigate]);

  const handleTopicToggle = async (subjectId, topicId, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/progress/subjects/${subjectId}/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ done: !currentStatus }),
      });
      const updatedSubjects = await response.json();
      if (!response.ok) throw new Error('Failed to update topic.');
      setSubjects(updatedSubjects);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveTopic = async (subjectId, topicId) => {
    if (!window.confirm("Are you sure you want to remove this topic?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/progress/subjects/${subjectId}/topics/${topicId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updatedSubjects = await response.json();
      if (!response.ok) throw new Error('Failed to remove topic.');
      setSubjects(updatedSubjects);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleRemoveSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to remove this entire subject?")) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/progress/subjects/${subjectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const updatedSubjects = await response.json();
      if (!response.ok) throw new Error('Failed to remove subject.');
      setSubjects(updatedSubjects);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const handleDataUpdate = (updatedSubjects) => {
    setSubjects(updatedSubjects);
  };

  const calculateSubjectProgress = (subject) => {
    if (!subject.topics || subject.topics.length === 0) return 0;
    const doneTopics = subject.topics.filter(topic => topic.done).length;
    return (doneTopics / subject.topics.length) * 100;
  };

  const calculateOverallProgress = () => {
    const allTopics = subjects.flatMap(subject => subject.topics);
    if (allTopics.length === 0) return 0;
    const doneTopics = allTopics.filter(topic => topic.done).length;
    return (doneTopics / allTopics.length) * 100;
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-white/20 mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Syllabus Tracker Dashboard</h1>
          <button onClick={handleSignOut} className="bg-red-500/80 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors">
            Sign Out
          </button>
        </header>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-2xl mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Overall Progress</h2>
          <ProgressBar progress={calculateOverallProgress()} />
        </div>
        
        <AddSubjectForm onSubjectAdded={handleDataUpdate} />
        
        {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">{error}</div>}

        <main className="space-y-6">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject._id} className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-2xl font-semibold text-primary-light">{subject.name}</h2>
                  <div className="w-full sm:w-2/5 flex items-center gap-4">
                    <ProgressBar progress={calculateSubjectProgress(subject)} />
                    <button onClick={() => handleRemoveSubject(subject._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors" title="Remove subject">&times;</button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {subject.topics.map((topic) => (
                    <li key={topic._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={topic.done}
                          onChange={() => handleTopicToggle(subject._id, topic._id, topic.done)}
                          className="mr-3 h-5 w-5 bg-transparent border-white/20 rounded accent-primary cursor-pointer"
                        />
                        <span className={topic.done ? 'line-through text-gray-400' : 'text-gray-200'}>
                          {topic.name}
                        </span>
                      </div>
                      <button onClick={() => handleRemoveTopic(subject._id, topic._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full transition-colors" title="Remove topic">&times;</button>
                    </li>
                  ))}
                </ul>
                <AddTopicForm subjectId={subject._id} onTopicAdded={handleDataUpdate} />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-black/20 rounded-2xl">
              <p className="text-gray-400">No subjects found. Add one above to get started!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
