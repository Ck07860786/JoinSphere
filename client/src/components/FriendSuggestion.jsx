import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../helper/PortUrl";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const FriendSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auth] = useAuth()


  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setError("");
  
   
  
        const response = await axios.get(`${BASE_URL}/api/users/suggestions`, {
          params: { query: "" },
          headers: {
            Authorization: `Bearer ${auth.token}`, 
          },
        });
  
        if (response.data.success) {
          setSuggestions(response.data.suggestions); 
          console.log(response.data.suggestions)
        } else {
          setError("Failed to fetch suggestions.");
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err); 
        setError("Error fetching suggestions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchSuggestions();
  }, [auth]);
  
  
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
        toast.success("Friend request sent successfully!");
      } else {
        toast.error(response.data.message || "Failed to send friend request.");
      }
    } catch (err) {
      console.error("Error sending friend request:", err); 
      alert("Error sending friend request. Please try again.");
    }
  };

  return (
<div className="bg-white mt-10 shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-6">
    Friend Suggestions
  </h2>

  {loading ? (
    <div className="text-center py-4">
      <p className="text-gray-600">Loading suggestions...</p>
    </div>
  ) : error ? (
    <div className="text-center py-4">
      <p className="text-red-500">{error}</p>
    </div>
  ) : suggestions.length === 0 ? (
    <div className="text-center py-4">
      <p className="text-gray-600">No suggestions available.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {suggestions.map((friend) => (
        <div
          key={friend._id}
          className="flex flex-col items-center  bg-slate-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
        >
          <img
            src={friend.profilePic || "https://via.placeholder.com/150"}
            alt={friend.username}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <div className="text-center">
            <h3 className="font-medium text-gray-700">{friend.username}</h3>
            <p className="text-sm text-gray-500">{friend.email}</p>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-blue-600 transition-all"
            onClick={() => sendFriendRequest(friend._id)}
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default FriendSuggestion;
