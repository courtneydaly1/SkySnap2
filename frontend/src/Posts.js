import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zipCode, setZipCode] = useState(''); // User input zip code
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState(null); // For checking if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get the userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Function to fetch posts based on zip code and page number
  const fetchPosts = useCallback(async (zipCode, pageNumber) => {
    if (!zipCode) return; // Don't fetch if no zip code entered

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to log in first.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/posts?zip_code=${zipCode}&page=${pageNumber}&per_page=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message === "No posts yet.") {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
    } catch (err) {
      setError('No current posts for this Zipcode or an error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search button click
  const handleSearch = () => {
    if (zipCode) {
      setPosts([]); // Clear previous posts when starting new search
      setPage(1); // Reset to first page
      fetchPosts(zipCode, 1); // Fetch posts for the entered zip code
    } else {
      setError('Please enter a valid ZIP code.');
    }
  };

  // Load more posts when button is clicked
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchPosts(zipCode, page + 1);
    }
  };

  // Navigate to create post page
  const handleCreatePost = () => {
    navigate('/posts/create');
  };

  return (
    <div className="posts-container">
      <h1>Search Posts by ZIP Code</h1>
      
      {/* Input for ZIP Code */}
      <div className="zipcode-search">
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP Code"
          disabled={loading}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      
      {loading && <p>Loading posts...</p>}

      {posts.length === 0 && !loading && !error && (
        <div className="no-posts">
          <p>No posts found for this ZIP code. Try searching again!</p>
        </div>
      )}

      {/* Display list of posts */}
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h2>{post.location}</h2>
            <p>{post.description}</p>
            <p><strong>Caption:</strong> {post.caption}</p>
            <p><strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}</p>
            {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
          </div>
        ))}
      </div>

      {/* Button to load more posts */}
      {loading && <p>Loading more posts...</p>}
      {hasMore && !loading && (
        <button onClick={loadMore} className="load-more-button">
          Load More Posts
        </button>
      )}

      {/* Create Post Button - Only visible if user is logged in */}
      {userId && (
        <button className="create-post-btn" onClick={handleCreatePost}>
          Create a New Post
        </button>
      )}

      <div id="load-more" style={{ height: '50px' }} />
    </div>
  );
}

export default Posts;




