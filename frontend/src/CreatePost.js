import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    try {
      // Basic Validation
      if (!location || !description || !caption) {
        setError('All fields are required.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      const response = await fetch('http://127.0.0.1:5000/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          description,
          caption,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      // Clear the form after successful submission
      setLocation('');
      setDescription('');
      setCaption('');

      // Navigate to the posts page
      navigate('/posts');
    } catch (err) {
      console.error('Error creating post', err);
      setError('Failed to create post. Please try again later.');
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
