import React, { useContext, useState } from 'react';
import { Card, Form, Button, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../usercontext';
import './customCss.css';

export default function SignupForm() {
  const { registerUser } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedRole === 'staff' || selectedRole === 'family_member') {
      try {
        // Check if username is available
        const isUsernameAvailable = await checkUsernameAvailability(username);

        if (isUsernameAvailable) {
          await registerUser(fullName, username, selectedRole);
          setShowSuccessToast(true);
          setTimeout(() => {
            setShowSuccessToast(false);
          }, 5000); // Toast will be shown for 5 seconds
        } else {
          setErrorMessage('Username is already taken. Please choose another.');
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
      }
    } else {
      console.error('Invalid role selected');
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`/api/check-username/${username}`); //API?
      const responseData = await response.json();
  
      if (responseData.status === 404) {
        return false; // Username not available
      } else if (responseData.status === 201) {
        return true; // Username available
      } else {
        throw new Error(`Unexpected response status: ${responseData.status}`);
      }
    } catch (error) {
      console.error('Error checking username availability:', error.message);
      throw new Error(`Error checking username availability: ${error.message}`);
    }
  };

  const showError = errorMessage ? <div className="error">{errorMessage}</div> : null;

  return (
    <Card className="p-4 custom-card">
      <Card.Header className="text-center custom-cardheader">Sign Up</Card.Header>
      <Card.Body>
      {showError}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label className="custom-formlabel">Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              maxLength="50"
              value={fullName}
              onChange={handleFullNameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label className="custom-formlabel">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              maxLength="30"
              value={username}
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="role">
            <Form.Label className="custom-formlabel">Role</Form.Label>
            <Form.Select value={selectedRole} onChange={handleRoleChange}>
              <option value="" disabled>Select your role</option>
              <option value="staff">Staff</option>
              <option value="family_member">Family Member</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 custom-button">
            Sign Up Now
          </Button>
        </Form>
        <Toast
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          delay={10000}
          autohide
          className="custom-toast">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>
            Signup successfully! You can now <Link to="/login">Log In</Link>.
          </Toast.Body>
        </Toast>
      </Card.Body>
    </Card>
  );
}
