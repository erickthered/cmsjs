import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { getArticles } from '../services/ArticleService';
import type { Article } from '../services/ArticleService';

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const allArticles = await getArticles();
        // Filter for published articles on the client-side for now
        const publishedArticles = allArticles.filter(article => article.status === 'published');
        setArticles(publishedArticles);
      } catch (err) {
        setError('Failed to fetch articles. The site may be temporarily down.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <Container><p>Loading articles...</p></Container>;
  }

  if (error) {
    return <Container><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container>
      <h1 className="my-4">Latest Articles</h1>
      {articles.length === 0 ? (
        <p>No articles have been published yet. Check back soon!</p>
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
                    {/* This is a simple truncation. A more robust solution might use a library or more complex logic. */}
                    {article.content.substring(0, 150)}...
                  </Card.Text>
                  <Card.Link href={`/article/${article.slug}`}>Read More</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;