import { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`, {
        username,
        password,
      });

      if (res.data.success) {
        setLoggedIn(true);
        fetchUsers(); // Load users after successful login
      } else {
        alert('Invalid login');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`);

      // ✅ Check if API response is an array
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        console.warn('Unexpected response:', res.data);
        setUsers([]);
        setError('Unexpected data format received from server.');
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="p-4 max-w-sm mx-auto">
        <h2 className="text-xl mb-2 font-bold">Admin Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Registered Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll Number</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Branch</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.rollNumber}</td>
                <td className="border p-2">{user.mobile}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.branch}</td>
                <td className="border p-2">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}