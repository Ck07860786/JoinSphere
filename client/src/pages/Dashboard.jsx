import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../helper/PortUrl";
import { useAuth } from "../context/authContext";
import { IoMdNotifications } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";

function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);



  const [auth] = useAuth();

  useEffect(() => {
    
    fetchFriendRequests();
    fetchFriends();
  }, [auth]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/all-friends`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Failed to fetch friends.");
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/friend-requests`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setFriendRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("Failed to fetch friend requests.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a username or email to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/search?query=${searchQuery.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setSearchResults(response.data.users || []);
    } catch (error) {
      toast.error("Failed to fetch search results. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/send-friend-request`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setSearchResults((prev) =>
          prev.map((user) =>
            user._id === friendId ? { ...user, requestSent: true } : user
          )
        );
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to send friend request.");
    }
  };

  const cancelFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/cancel-friend-request`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setSearchResults((prev) =>
          prev.map((user) =>
            user._id === friendId ? { ...user, requestSent: false } : user
          )
        );
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to cancel friend request.");
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/accept-friend-request`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendId)
        );
        fetchFriends(); 
      } else {
        toast.error(response.data.message || "Failed to accept request.");
      }
    } catch (error) {
      toast.error("Failed to accept friend request.");
    }
  };

  const declineFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/decline-friend-request`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendId)
        );
      } else {
        toast.error(response.data.message || "Failed to decline request.");
      }
    } catch (error) {
      toast.error("Failed to decline friend request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 flex">
   
    <div className="w-1/4 h-screen  bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6 overflow-y-auto sticky top-10 left-10">
      <div className="flex gap-2 items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Friends</h2>
        <FaUserFriends className="text-blue-500 text-xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Total Friends ({friends.length})
      </h2>
      <div className="space-y-4">
        {friends.length > 0 ? (
          friends.map((friend) => <div key={friend._id}>{friend.username}</div>)
        ) : (
          <p className="text-gray-600">You have no friends yet.</p>
        )}
      </div>
      <hr />
      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
        Friend Requests
      </h2>
      <div className="space-y-4">
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <div key={request._id} className="flex items-center space-x-4">
              <img
                className="w-16 h-16 rounded-full"
                src={request.profilePicture || "https://via.placeholder.com/100"}
                alt={request.username}
              />
              <div>
                <p className="font-semibold text-gray-800">{request.username}</p>
                <p className="text-sm text-gray-600">{request.email}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => acceptFriendRequest(request._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-full"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineFriendRequest(request._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-full"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending friend requests.</p>
        )}
      </div>
    </div>
  
   
    <div className="flex-grow max-w-4xl w-full flex flex-col items-center px-4  overflow-y-auto">
      {/* Sticky Search Bar */}
    <div className="sticky top-10  mb-10  bg-gradient-to-r from-white to-blue-100 z-10 w-full max-w-lg">
      <form
        onSubmit={handleSearch}
        className="w-full flex space-x-3 items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
      >
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow rounded-full px-5 py-3 border focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-300"
        >
          Search
        </button>
      </form>
    </div>
  
      {loading && (
        <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">
          Searching...
        </p>
      )}
  
      {!loading && searchResults.length > 0 && (
        <div className="w-full max-w-3xl  bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search Results
          </h2>
          <ul className="space-y-4">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between  bg-gradient-to-r from-white to-blue-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={user.profilePicture || "https://via.placeholder.com/100"}
                    alt="User"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  {user.requestSent ? (
                    <button
                      onClick={() => cancelFriendRequest(user._id)}
                      className="px-5 py-2 font-medium rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
                    >
                      Cancel Request
                    </button>
                  ) : user.isFriend ? (
                    <span className="text-green-600 font-medium">Friend</span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user._id)}
                      className="px-5 py-2 font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
  );
}

export default UserDashboard;
