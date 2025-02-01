import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

function CreatePost() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null); // Preview for media
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null); // URL after upload
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User not logged in. Please log in first.');
      navigate('/home');  // Redirect to home or login page if not logged in
    }
  }, [navigate]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result); // Preview the selected media before upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!location || !description || !caption || !userId) {
      setError('All fields are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('caption', caption);
    formData.append('user_id', userId);
    if (media) {
      formData.append('media', media);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/posts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        mode: 'cors',
      });

      const res = await response.json();
      const newPost = res;

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      // Clear the form after successful submission
      setLocation('');
      setDescription('');
      setCaption('');
      setMedia(null);
      setMediaPreview(null);  

      // Save the image URL returned from the backend
      setUploadedMediaUrl(`http://127.0.0.1:5000${newPost.image_url}`);

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
      {error && <p className="error-message">{error}</p>}
      {userId && (
        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location/Zipcode"
            required
            className="form-input"
          />
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of the weather"
            required
            className="form-textarea"
          />
          <textarea
            id="caption"
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Short caption"
            required
            className="form-textarea"
          />
          <input
            type="file"
            id="media"
            name="media"
            aria-label="Upload media"
            onChange={handleMediaChange}
            accept="image/*,video/*"
            className="form-file-input"
          />
          
          {mediaPreview && (
            <div className="media-preview">
              <h3>Preview:</h3>
              {mediaPreview && mediaPreview.includes('image') ? (
                <img src={mediaPreview} alt="Preview" className="media-image" />
              ) : (
                <video controls className="media-video">
                  <source src={mediaPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn">Create Post</button>
        </form>
      )}

      {/* Show the uploaded image after post creation */}
      {uploadedMediaUrl && (
        <div className="uploaded-media">
          <h3>Uploaded Media:</h3>
          {uploadedMediaUrl.includes('image') ? (
            <img src={uploadedMediaUrl} alt="Uploaded Post Media" className="uploaded-media-image" />
          ) : (
            <video controls className="uploaded-media-video">
              <source src={uploadedMediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
}

export default CreatePost;




