import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import UserPage from './pages/UserPage';
import SettingsPage from './pages/SettingsPage';
import PublicLayout from './components/PublicLayout';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoryArticlesPage from './pages/CategoryArticlesPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
        <Route path="/category/:categorySlug" element={<CategoryArticlesPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />


      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/categories" element={<CategoryPage />} />
          <Route path="/dashboard/articles" element={<ArticlePage />} />
          <Route path="/dashboard/users" element={<UserPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          {/* Other dashboard routes will go here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;