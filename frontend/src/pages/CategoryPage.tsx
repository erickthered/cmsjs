import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/CategoryService';
import type { Category } from '../services/CategoryService';

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories.');
      console.error(err);
    }
  };

  const handleShowModal = (category: Category | null = null) => {
    setCurrentCategory(category);
    setFormData({
      name: category?.name || '',
      description: category?.description || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (currentCategory) {
        await updateCategory(currentCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save category. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Category Management</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
        Add New Category
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>{cat.description}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(cat)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(cat._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {currentCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryPage;
