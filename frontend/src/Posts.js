import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
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
  const location = useLocation(); // To access the URL query parameters

  useEffect(() => {
    // Try to get the userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }

    // Extract the zip_code from the query string if available
    const params = new URLSearchParams(location.search);
    const zipFromQuery = params.get('zip_code');
    if (zipFromQuery) {
      setZipCode(zipFromQuery);
      fetchPosts(zipFromQuery, 1); // Fetch posts directly based on the zip code from URL
    }
  }, [location.search]);

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

  // Handle search button click (if a user wants to search manually)
  const handleSearch = () => {
    if (zipCode) {
      setPosts([]); // Clear previous posts when starting new search
      setPage(1); // Reset to first page
      fetchPosts(zipCode, 1); // Fetch posts for the entered zip code
    } else {
      setError('Please enter a valid ZIP code.');
    }
  };

  // Handle "Enter" key press for search input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger the search on Enter key
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
      {/* Buttons at the top */}
      <div className="top-buttons">
        <h1>Search Snaps by ZIP Code</h1>
        
        {/* Input for ZIP Code (only visible if the user wants to manually search) */}
        <div className="zipcode-search">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP Code"
            disabled={loading}
            className='zipcode-input'
            onKeyDown={handleKeyDown}  // Listen for "Enter" key press
          />
          <button className="zipcode-search-btn" onClick={handleSearch} disabled={loading}>
            Search
          </button>
        </div>

        {/* Create Post Button - Only visible if user is logged in */}
        {userId && (
          <button className="create-post-btn" onClick={handleCreatePost}>
            Create a New Snap
          </button>
        )}
      </div>

      {/* Error and Loading Message */}
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading posts...</p>}

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

      <div id="load-more" style={{ height: '50px' }} />
    </div>
  );
}

export default Posts;


