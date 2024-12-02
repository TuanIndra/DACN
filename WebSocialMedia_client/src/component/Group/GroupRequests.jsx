import React, { useEffect, useState } from 'react';
import { getPendingRequests, handleMembershipRequest, isAdminOfGroup } from '../../api/groupApi';

const GroupRequests = ({ groupId }) => {
  const [requests, setRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminAndFetchRequests = async () => {
      try {
        // Kiểm tra quyền admin
        const adminResponse = await isAdminOfGroup(groupId);
        if (adminResponse.data) {
          setIsAdmin(true);

          // Lấy danh sách yêu cầu nếu là admin
          const response = await getPendingRequests(groupId);
          setRequests(response.data || []);
        } else {
          setError('You do not have permission to view group requests.');
        }
      } catch (err) {
        console.error('Error checking admin status or fetching requests:', err);
        setError(err.response?.data || 'Failed to load group requests.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchRequests();
  }, [groupId]);

  const handleRequest = async (memberId, action) => {
    try {
      // Lấy thông tin người dùng từ danh sách yêu cầu
      const userRequest = requests.find((req) => req.id === memberId);
      console.log('Handling request for:', userRequest);
  
      if (!userRequest) {
        console.error('Member not found in requests list.');
        return;
      }
  
      // Gọi API xử lý yêu cầu
      await handleMembershipRequest(groupId, userRequest.userId, action);
  
      // Thông báo và cập nhật danh sách yêu cầu
      alert(`Request ${action}ed successfully`);
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== memberId)
      );
    } catch (error) {
      console.error(`Error handling request for member ${memberId}:`, error);
      alert('Failed to handle request');
    }
  };
  

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Pending Requests</h3>
      {requests.length > 0 ? (
        requests.map((request) => (
          <div key={request.id} className="border p-2 mb-2 rounded flex justify-between items-center">
            <span>{request.fullName || 'Unknown User'}</span>
            <div>
              <button
                onClick={() => handleRequest(request.id, 'accept')}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleRequest(request.id, 'reject')}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default GroupRequests;
