import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { getArticle } from '../services/ArticleService';
import type { Article } from '../services/ArticleService';
import { getCategory } from '../services/CategoryService';
import type { Category } from '../services/CategoryService';

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleAndCategory = async () => {
      if (!slug) {
        setError('Article slug is missing.');
        setLoading(false);
        return;
      }

      try {
        const fetchedArticle = await getArticle(slug);
        setArticle(fetchedArticle);

        if (fetchedArticle.category) {
          const fetchedCategory = await getCategory(fetchedArticle.category);
          setCategory(fetchedCategory);
        }
      } catch (err) {
        setError('Failed to fetch article. It might not exist or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndCategory();
  }, [slug]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading article...</p>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  if (!article) {
    return <Container className="mt-5"><Alert variant="info">Article not found.</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1">{article.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Published on {new Date(article.createdAt).toLocaleDateString()} by {article.author} {/* Author name will be displayed later */}
            {category && <> in <Card.Link href={`/category/${category.slug}`}>{category.name}</Card.Link></>}
          </Card.Subtitle>
          <hr />
          <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{article.content}</Card.Text>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3">
              <strong>Tags:</strong> {article.tags.join(', ')}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ArticleDetailPage;
