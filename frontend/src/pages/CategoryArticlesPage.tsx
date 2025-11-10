import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { getArticles } from '../services/ArticleService';
import type { Article } from '../services/ArticleService';
import { getCategories } from '../services/CategoryService';
import type { Category } from '../services/CategoryService';

const CategoryArticlesPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      if (!categorySlug) {
        setError('Category slug is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First, find the category by slug to get its ID
        const allCategories = await getCategories();
        const foundCategory = allCategories.find(cat => cat.slug === categorySlug);

        if (!foundCategory) {
          setError(`Category with slug "${categorySlug}" not found.`);
          setLoading(false);
          return;
        }
        setCategory(foundCategory);

        // Then, fetch all articles and filter by category ID
        const allArticles = await getArticles();
        const filteredArticles = allArticles.filter(
          article => article.category === foundCategory._id && article.status === 'published'
        );
        setArticles(filteredArticles);
      } catch (err) {
        setError('Failed to fetch articles for this category. The site may be temporarily down.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndArticles();
  }, [categorySlug]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading articles for category...</p>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <h1 className="my-4">Articles in {category?.name || 'Category'}</h1>
      {articles.length === 0 ? (
        <p>No published articles found in this category.</p>
      ) : (
        <Row>
          {articles.map(article => (
            <Col key={article._id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Published on {new Date(article.createdAt).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>
                    {article.content.substring(0, 150)}...
                  </Card.Text>
                  <Card.Link as={Link} to={`/article/${article.slug}`}>Read More</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoryArticlesPage;
