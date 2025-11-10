import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../services/ArticleService';
import type { Article } from '../services/ArticleService';
import { getCategories } from '../services/CategoryService';
import type { Category } from '../services/CategoryService';

const ArticlePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: 'draft',
    tags: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError('Failed to fetch articles.');
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories for dropdown.');
      console.error(err);
    }
  };

  const handleShowModal = (article: Article | null = null) => {
    setCurrentArticle(article);
    setFormData({
      title: article?.title || '',
      content: article?.content || '',
      category: article?.category || '',
      status: article?.status || 'draft',
      tags: article?.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentArticle(null);
    setFormData({
      title: '',
      content: '',
      category: '',
      status: 'draft',
      tags: '',
    });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const articleData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    try {
      if (currentArticle) {
        await updateArticle(currentArticle._id, articleData);
      } else {
        await createArticle(articleData);
      }
      fetchArticles();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save article. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        fetchArticles();
      } catch (err) {
        setError('Failed to delete article.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Article Management</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
        Add New Article
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Category</th>
            <th>Status</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>{article.slug}</td>
              <td>{categories.find(cat => cat._id === article.category)?.name || 'N/A'}</td>
              <td>{article.status}</td>
              <td>{article.author}</td> {/* This will eventually show author name */}
              <td>
                <Button variant="info" size="sm" onClick={() => handleShowModal(article)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(article._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentArticle ? 'Edit Article' : 'Add New Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formArticleTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formArticleContent" className="mt-2">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formArticleCategory" className="mt-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formArticleStatus" className="mt-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formArticleTags" className="mt-2">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., tech, programming, tutorial"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {currentArticle ? 'Save Changes' : 'Create Article'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ArticlePage;
