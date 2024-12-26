import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreatePost.css"

function CreatePost() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("http://127.0.0.1:5000/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          description,
          caption,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      navigate("/posts"); // Navigate to the posts page after creating a post
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
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
        />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
