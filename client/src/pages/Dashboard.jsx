import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../helper/PortUrl";
import { useAuth } from "../context/authContext";
import { IoMdNotifications } from "react-icons/io";

import FriendSuggestion from "../components/FriendSuggestion";
import Logout from "../components/Logout";

function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false); 

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
      const response = await axios.get(`${BASE_URL}/api/users/friend-requests`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 flex flex-col md:flex-row">
      <div className="absolute top-6 right-6 z-20">
        <Logout />
      </div>

      <div className="w-full md:w-1/3 h-auto md:h-screen bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6 overflow-y-auto sticky mb-8 md:mb-0">
        <div className="flex gap-2 items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Friends</h2>
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
      
        <div className="hidden md:block">
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
      </div>

      <div className="flex-grow max-w-4xl w-full flex flex-col items-center px-4 overflow-y-auto">
        
        <div className="sticky top-10 mb-10 bg-gradient-to-r from-white to-blue-100 z-10 w-full max-w-lg">
          <form
            onSubmit={handleSearch}
            className="w-full flex space-x-3 items-center bg-transparent p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
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
          <div className="w-full text-center">
            <p className="text-lg text-gray-600">Searching...</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
            <ul className="space-y-4">
              {searchResults.map((user) => (
                <li key={user._id} className="flex justify-between items-center p-4 rounded-lg bg-white shadow-md hover:bg-blue-50">
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={user.profilePicture || "https://via.placeholder.com/100"}
                      alt={user.username}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      user.requestSent
                        ? cancelFriendRequest(user._id)
                        : sendFriendRequest(user._id)
                    }
                    className={`px-4 py-2 rounded-full ${
                      user.requestSent
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {user.requestSent ? "Cancel Request" : "Send Request"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

      
        <div className="md:hidden">
          <IoMdNotifications
            className="text-3xl cursor-pointer"
            onClick={() => setShowRequests((prev) => !prev)}
          />
        </div>

        {showRequests && (
          <div className="md:hidden w-full mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
        )}
        <FriendSuggestion/>
      </div>
    </div>
  );
}

export default UserDashboard;
