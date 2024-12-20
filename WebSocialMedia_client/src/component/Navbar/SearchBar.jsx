import React, { useState, useEffect, useRef } from 'react';
import { searchApi } from '../../api/searchApi'; // Import search API function
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], groups: [] });
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const getAvatarUrl = (avatarUrl) => {
    // URL for the default avatar in the database
    const defaultAvatarUrl = 'http://26.159.243.47:8082/uploads/default-avatar.png';
    
  
    // If the avatar is null, empty, or matches the default avatar URL, return a default avatar
    if (!avatarUrl || avatarUrl === defaultAvatarUrl) {
  
      return defaultAvatarUrl;
    }
  
    // Remove duplicate slashes and ensure correct path resolution
    const cleanedUrl = avatarUrl.replace(/\/{2,}/g, '/');
    return avatarUrl.startsWith('http')
      ? cleanedUrl // Use full URL if provided
      : `http://26.159.243.47:8082/uploads${cleanedUrl.replace('/uploads', '')}`;
  
  };
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search results
  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults({ users: [], groups: [] });
      return;
    }
    try {
      const response = await searchApi(keyword);
      setSearchResults(response);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults({ users: [], groups: [] });
    }
  };

  // Handle result click
  const handleResultClick = (result, type) => {
    if (type === 'user') {
      navigate(`/profile/${result.id}`);
    } else if (type === 'group') {
      navigate(`/groups/${result.id}`);
    }
    setSearchKeyword('');
    setSearchResults({ users: [], groups: [] });
    setIsFocused(false);
  };

  return (
    <div className="relative w-64" ref={searchRef}>
      <input
        type="text"
        value={searchKeyword}
        placeholder="Tìm kiếm"
        onChange={(e) => {
          setSearchKeyword(e.target.value);
          handleSearch(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        className="w-full rounded-full border px-4 py-2 focus:outline-none dark:bg-gray-800 dark:text-white"
      />
      {isFocused && (searchResults.users.length > 0 || searchResults.groups.length > 0) && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-md z-50">
          {searchResults.users.length > 0 && (
            <>
              <h3 className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                Người dùng
              </h3>
              {searchResults.users.map((user) => (
                <div
                  key={`user-${user.id}`}
                  className="px-4 py-2 hover:bg-primary/30 cursor-pointer flex items-center"
                  onClick={() => handleResultClick(user, 'user')}
                >
                  <img
                    src={getAvatarUrl(user.avatarUrl)}
                    alt={user.fullName || 'User'}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span>{user.fullName}</span>
                </div>
              ))}
            </>
          )}
          {searchResults.groups.length > 0 && (
            <>
              <h3 className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400">
                Nhóm
              </h3>
              {searchResults.groups.map((group) => (
                <div
                  key={`group-${group.id}`}
                  className="px-4 py-2 hover:bg-primary/30 cursor-pointer"
                  onClick={() => handleResultClick(group, 'group')}
                >
                  <span>{group.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
