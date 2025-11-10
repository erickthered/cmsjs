import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/dashboard">CMS Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/dashboard/categories">Categories</Nav.Link>
              <Nav.Link href="/dashboard/articles">Articles</Nav.Link>
              {user?.group === 'admin' && <Nav.Link href="/dashboard/users">Users</Nav.Link>}
              {user?.group === 'admin' && <Nav.Link href="/dashboard/settings">Settings</Nav.Link>}
              {/* Add more navigation links here later */}
            </Nav>
            <Nav>
              {user && <Navbar.Text className="me-3">Signed in as: {user.fullName || user.email}</Navbar.Text>}
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 py-3">
        <Outlet /> {/* This is where child routes will be rendered */}
      </Container>

      {/* Optional: Add a footer here */}
      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} CMS. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default DashboardLayout;
