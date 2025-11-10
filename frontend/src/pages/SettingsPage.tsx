import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Container } from 'react-bootstrap';
import { getSettings, updateSettings } from '../services/SettingsService';
import type { Settings } from '../services/SettingsService';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<Settings, '_id' | 'createdAt' | 'updatedAt'>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.group === 'admin') {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      setFormData({
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription || '',
        contactEmail: data.contactEmail || '',
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          twitter: data.socialLinks?.twitter || '',
          instagram: data.socialLinks?.instagram || '',
          linkedin: data.socialLinks?.linkedin || '',
        },
      });
    } catch (err) {
      setError('Failed to fetch settings.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateSettings(formData);
      setSuccess('Settings updated successfully!');
      fetchSettings(); // Re-fetch to ensure state is fresh
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <Container><p>Loading settings...</p></Container>;
  }

  if (currentUser?.group !== 'admin') {
    return <Alert variant="danger">You do not have permission to view this page.</Alert>;
  }

  return (
    <Container>
      <h2 className="mb-4">Site Settings</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSiteTitle" className="mb-3">
              <Form.Label>Site Title</Form.Label>
              <Form.Control
                type="text"
                name="siteTitle"
                value={formData.siteTitle || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSiteDescription" className="mb-3">
              <Form.Label>Site Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="siteDescription"
                value={formData.siteDescription || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formContactEmail" className="mb-3">
              <Form.Label>Contact Email</Form.Label>
              <Form.Control
                type="email"
                name="contactEmail"
                value={formData.contactEmail || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <h4 className="mt-4 mb-3">Social Links</h4>
            <Form.Group controlId="formSocialFacebook" className="mb-3">
              <Form.Label>Facebook URL</Form.Label>
              <Form.Control
                type="url"
                name="socialLinks.facebook"
                value={formData.socialLinks?.facebook || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSocialTwitter" className="mb-3">
              <Form.Label>Twitter URL</Form.Label>
              <Form.Control
                type="url"
                name="socialLinks.twitter"
                value={formData.socialLinks?.twitter || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSocialInstagram" className="mb-3">
              <Form.Label>Instagram URL</Form.Label>
              <Form.Control
                type="url"
                name="socialLinks.instagram"
                value={formData.socialLinks?.instagram || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSocialLinkedin" className="mb-3">
              <Form.Label>LinkedIn URL</Form.Label>
              <Form.Control
                type="url"
                name="socialLinks.linkedin"
                value={formData.socialLinks?.linkedin || ''}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Save Settings
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;
