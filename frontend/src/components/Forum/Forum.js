import React, { useState } from 'react';
import './Forum.css';

const Forum = () => {
  const initialPosts = [
    { id: 1, user: 'User1', content: 'This is the first post in the forum!', date: '2024-09-01', topic: 'General' },
    { id: 2, user: 'User2', content: 'Welcome to the dark-themed forum!', date: '2024-09-01', topic: 'Announcements' },
    { id: 3, user: 'User3', content: 'Let’s discuss React components!', date: '2024-09-01', topic: 'React' },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = ['All', 'General', 'Announcements', 'React'];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleAddToCollection = (postId) => {
    const topic = prompt('Enter the topic name for this post:');
    if (topic) {
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, topic } : post
      );
      setPosts(updatedPosts);
    }
  };

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic === 'All' ? '' : topic);
  };

  const filteredPosts = posts.filter(
    post =>
      post.content.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedTopic ? post.topic === selectedTopic : true)
  );

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  return (
    <div className="forum-layout">
      <div className="sidebar">
        <h2>Collections</h2>
        <ul>
          {topics.map(topic => (
            <li key={topic} onClick={() => handleTopicSelection(topic)}>
              {topic}
            </li>
          ))}
        </ul>
      </div>
      <div className="forum-container">
        <div className="forum-controls">
          <input
            type="text"
            placeholder="Filter posts..."
            value={filter}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select value={sortOrder} onChange={handleSortChange} className="sort-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <h1 className="forum-title">Forum</h1>
        <div className="posts-list">
          {sortedPosts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span className="post-user">{post.user}</span>
                <span className="post-date">{post.date}</span>
                <button onClick={() => handleAddToCollection(post.id)} className="add-to-collection-btn">
                  Add to Collection
                </button>
              </div>
              <p className="post-content">{post.content}</p>
              <p className="post-topic">Topic: {post.topic}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;