import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// 1. Context API for Global State Management
const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Complete React Documentation Report', category: 'College', completed: false, priority: 'High' },
      { id: 2, title: 'Push React Code to GitHub', category: 'Development', completed: true, priority: 'Medium' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos([...todos, { ...todo, id: Date.now(), completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);

// 2. Navigation Bar Component
const Navbar = () => (
  <nav style={{ padding: '1rem 2rem', background: '#2563eb', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2 style={{ margin: 0 }}>TaskTracker Pro</h2>
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
      <Link to="/add" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>+ New Task</Link>
    </div>
  </nav>
);

// 3. Main Dashboard Page
const Dashboard = () => {
  const { todos, toggleTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState('All');

  const filteredTodos = todos.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Pending') return !t.completed;
    return true;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Task Dashboard</h1>
      <p>Manage your daily workflow and tasks effectively.</p>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        {['All', 'Pending', 'Completed'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{ 
              padding: '0.5rem 1rem', 
              background: filter === f ? '#2563eb' : '#e5e7eb', 
              color: filter === f ? 'white' : 'black', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#f9fafb', marginBottom: '0.75rem' }}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#9ca3af' : '#1f2937' }}>
              <strong style={{ color: '#2563eb' }}>[{todo.category}]</strong> {todo.title} <em>({todo.priority} Priority)</em>
            </span>
            <div>
              <button 
                onClick={() => toggleTodo(todo.id)} 
                style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: todo.completed ? '#d1d5db' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button 
                onClick={() => deleteTodo(todo.id)} 
                style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 4. Add Task Page
const AddTask = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('College');
  const [priority, setPriority] = useState('Medium');
  const { addTodo } = useTodos();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a task title');
    addTodo({ title, category, priority });
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Task Title:</label>
          <input 
            type="text" 
            placeholder="Enter task name..." 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '0.6rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Category:</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem' }}>
            <option value="College">College</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>Priority:</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '0.6rem' }}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Task
        </button>
      </form>
    </div>
  );
};

// 5. Main Root Component
export default function App() {
  return (
    <TodoProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTask />} />
        </Routes>
      </BrowserRouter>
    </TodoProvider>
  );
}