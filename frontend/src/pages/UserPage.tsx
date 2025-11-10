import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getUsers, createUser, updateUser, deleteUser } from '../services/UserService';
import type { User } from '../services/UserService';
import { useAuth } from '../contexts/AuthContext';

const UserPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUserForm, setCurrentUserForm] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    email: '',
    password: '',
    group: 'editor',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.group === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    }
  };

  const handleShowModal = (user: User | null = null) => {
    setCurrentUserForm(user);
    setFormData({
      fullName: user?.fullName || '',
      nickName: user?.nickName || '',
      email: user?.email || '',
      password: '', // Always clear password for security
      group: user?.group || 'editor',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUserForm(null);
    setFormData({ fullName: '', nickName: '', email: '', password: '', group: 'editor' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Don't submit an empty password on update unless it's intended to be empty
    const userData: any = { ...formData };
    if (currentUserForm && !formData.password) {
      delete userData.password;
    }

    try {
      if (currentUserForm) {
        await updateUser(currentUserForm._id, userData);
      } else {
        await createUser(userData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save user. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (currentUser?.group !== 'admin') {
    return <Alert variant="danger">You do not have permission to view this page.</Alert>;
  }

  return (
    <div>
      <h2>User Management</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
        Add New User
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.group}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(user)}>Edit</Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                  disabled={user._id === currentUser?._id} // Disable deleting self
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUserForm ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formUserNickName" className="mt-2">
              <Form.Label>Nickname</Form.Label>
              <Form.Control type="text" name="nickName" value={formData.nickName} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formUserEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formUserPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder={currentUserForm ? 'Leave blank to keep current password' : ''} required={!currentUserForm} />
            </Form.Group>
            <Form.Group controlId="formUserGroup" className="mt-2">
              <Form.Label>Group</Form.Label>
              <Form.Control as="select" name="group" value={formData.group} onChange={handleChange} required>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {currentUserForm ? 'Save Changes' : 'Create User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserPage;
