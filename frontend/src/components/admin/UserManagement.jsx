import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import AddUserModal from './AddUserModal';
import './AdminManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setDeleting(userId);
        setError(null);
        setSuccessMessage(null);
        
        const result = await adminService.deleteUser(userId);
        
        // Show success message
        setSuccessMessage(result.message);
        
        // Remove user from list
        setUsers(users.filter(user => user.id !== userId));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
      } catch (err) {
        setError(err.message || 'Failed to delete user');
        console.error(err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleUserAdded = () => {
    // Refresh the users list
    fetchUsers();
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="user-management">
      <div className="management-header">
        <div>
          <h3>User Management</h3>
          <p>Total Users: {users.length}</p>
        </div>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className={`delete-btn ${deleting === user.id ? 'deleting' : ''}`}
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleting === user.id}
                  >
                    {deleting === user.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UserManagement;
