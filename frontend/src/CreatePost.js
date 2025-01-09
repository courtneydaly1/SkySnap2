import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);  // To store the selected media
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);  // Store user_id here
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user ID from the token (assuming it's stored in localStorage or sessionStorage)
    const token = localStorage.getItem('token');  // Retrieve token
    if (token) {
      // Decode token to get user info (like user_id)
      const user = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT token
      setUserId(user.id);  // Set the user id from token
    } else {
      setError('User not logged in.');
    }
  }, []);

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);  // Only store the first selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    // Log the current state values for debugging
    console.log({
        location,
        description,
        caption,
        userId,
        media,
    });

    if (!location || !description || !caption || !userId) {
      setError('All fields are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    // Create FormData object to handle file uploads
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('caption', caption);
    formData.append('user_id', userId); 
    if (media) {
      formData.append('media', media);
    }

    try {
      // Send POST request to Flask API to create the post
      const response = await fetch('http://127.0.0.1:5000/posts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Send the FormData object containing the file
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      // Clear the form after successful submission
      setLocation('');
      setDescription('');
      setCaption('');
      setMedia(null);

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
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Zipcode"
          required
        />
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of weather"
          required
        />
        <textarea
          id="caption"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Short caption"
          required
        />
        <input
          type="file"
          id="media"
          name="media"
          onChange={handleMediaChange}
          accept="image/*,video/*"  // Accepts images and videos
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;


