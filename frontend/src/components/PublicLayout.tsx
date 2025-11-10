import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { getCategories } from '../services/CategoryService';
import type { Category } from '../services/CategoryService';

const PublicLayout: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories for public layout:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">My CMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {categories.length > 0 && (
                <NavDropdown title="Categories" id="basic-nav-dropdown">
                  {categories.map(cat => (
                    <NavDropdown.Item as={Link} to={`/category/${cat.slug}`} key={cat._id}>
                      {cat.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
              {/* Add more public navigation links here later */}
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 py-3">
        <Outlet /> {/* This is where child routes will be rendered */}
      </Container>

      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} My CMS. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
