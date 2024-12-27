import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [zipCode, setZipCode] = useState(null); // State to store the user's ZIP code
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (zipCode, pageNumber) => {
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
      if (data.message) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetZipCode = () => {
    navigate('/profile/set-zipcode');
  };

  useEffect(() => {
    // Fetch the user's ZIP code when the component mounts
    const fetchUserZipCode = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to log in first.');
          return;
        }

        const response = await fetch('http://127.0.0.1:5000/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile.');
        }

        const data = await response.json();
        const zipCode = data.user.local_zipcode;

        if (zipCode) {
          setZipCode(zipCode);
          fetchPosts(zipCode, page); // Fetch posts once ZIP code is available
        } else {
          setError('You need to set your ZIP code first.');
        }
      } catch (err) {
        setError('Failed to fetch user data.');
      }
    };

    fetchUserZipCode();
  }, [fetchPosts, page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="posts-container">
      <h1>Posts</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!zipCode ? (
        <div className="no-zipcode">
          <p>You haven't set your ZIP code yet.</p>
          <button onClick={handleSetZipCode}>Set Your ZIP Code</button>
        </div>
      ) : posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet.</p>
          <button onClick={() => navigate('/posts/create')}>Create a Post</button>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2>{post.location}</h2>
              <p>{post.description}</p>
              <p><strong>Caption:</strong> {post.caption}</p>
              <p><strong>Created At:</strong> {new Date(post.created_at).toLocaleString()}</p>
              {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
              <div className="post-weather">
                {post.realtime_weather && (
                  <div>
                    <strong>Temperature:</strong> {post.realtime_weather.temperature}°F
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p>Loading more posts...</p>}

      <div id="load-more" style={{ height: '50px' }} />
    </div>
  );
}

export default Posts;

