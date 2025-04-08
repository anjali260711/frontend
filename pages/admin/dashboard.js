// frontend/pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => {
        // ✅ Handle both array or object response safely
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          console.warn("Unexpected API format:", res.data);
          setUsers([]);
          setError("Unexpected API response");
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.rollNumber}</td>
                <td>{u.mobile}</td>
                <td>{u.email}</td>
                <td>{u.branch}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}