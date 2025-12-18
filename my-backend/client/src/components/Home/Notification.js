import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const Notification = () => {
  
  const [acceptedRequest, setAcceptedRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ id: '', function: '' });
  //mentor part
  // Step 1: Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/login/calendar', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user info');
        const data = await response.json();
        setUser({ id: data.id, function: data.function });
      } catch (error) {
        console.error(error.message);
        setError('Failed to fetch user info');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
  if (!user.id) return;

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      const filteredRequests = response.data.data.filter(
        (request) => request.receiver === user.id && request.status === 'pending'
      );

      // Fetch sender info for each request
      const enrichedRequests = await Promise.all(
        filteredRequests.map(async (req) => {
          try {
            const senderRes = await axios.get(`http://localhost:5000/api/users/notif/${req.sender}`);
            return {
              ...req,
              senderName: senderRes.data.name,
              senderSurname: senderRes.data.surname,
            };
          } catch (err) {
            return {
              ...req,
              senderName: 'Unknown',
              senderSurname: '',
            };
          }
        })
      );

        setRequests(enrichedRequests);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user.id]);
  const acceptRequest =async(request) =>{
    try{
      const response = await fetch('http://localhost:5000/api/appointment',{
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          student : request.sender ,
          mentor : request.receiver,
          request : request._id ,
          time : request.time,
        })
      });
      const data = await response.json();
      if(response.ok){
        alert('Appointment set successfully!');
        console.log('Appointment saved:', data);
        const patchRes=await fetch(`http://localhost:5000/api/requests/${request._id}/accept`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!patchRes.ok) throw new Error('Failed to update request status');
        setRequests((prevRequests) =>
        prevRequests.filter((r) => r._id !== request._id)
      );
      }else {
        alert('Appointment failed');
        console.error(data);
      }
    }catch(error){
      console.error('Error:', error);
    }
  }
  //student side
  useEffect(() => {
    if (!user.id || user.function !== 'student') return;

    const fetchAcceptedRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests');
        const myAccepted = res.data.data.filter(
          (req) => req.sender === user.id && req.status === 'accepted'
        );

        const enriched = await Promise.all(
          myAccepted.map(async (req) => {
            try {
              const recRes = await axios.get(
                `http://localhost:5000/api/users/notif/${req.receiver}`
              );
              return {
                ...req,
                receiverName: recRes.data.name,
                receiverSurname: recRes.data.surname,
              };
            } catch {
              return {
                ...req,
                receiverName: 'Unknown',
                receiverSurname: '',
              };
            }
          })
        );

        setAcceptedRequests(enriched);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, [user.id, user.function]);
  const navigate = useNavigate();

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (user.function === 'student') {
    return (
      <div className="container mt-5">
    <h2 className="mb-4 text-center text-primary">Accepted Appointments</h2>
    {acceptedRequest.length === 0 ? (
      <p className="text-muted text-center">No accepted appointments yet.</p>
    ) : (
      <div className="row g-4">
        {acceptedRequest.map((req, index) => (
          <motion.div
            key={index}
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title text-secondary">{req.subject}</h5>
                <p className="mb-1">
                  <strong>Mentor:</strong> {req.receiverName} {req.receiverSurname}
                </p>
                <p className="text-muted mb-0">
                  <strong>Time:</strong> {new Date(req.time).toLocaleString()}
                </p>
                <div className="text-end mt-3">
                  <Trash2 style={{ cursor: 'pointer', color: '#dc3545' }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>

  );
  }
  if (user.function === 'mentor') {
    return (
    <div className="container mt-5">
    <h2 className="mb-4 text-center text-primary">Incoming Requests</h2>
    {requests.length === 0 ? (
      <p className="text-muted text-center">No appointment requests at the moment.</p>
    ) : (
      <div className="row g-4">
        {requests.map((request, index) => (
          <motion.div
            key={index}
            className="col-md-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title text-secondary">{request.subject}</h5>
                <p className="mb-1">
                  <strong>Student:</strong> {request.senderName} {request.senderSurname}
                </p>
                <p className="mb-1">
                  <strong>Description:</strong> {request.description}
                </p>
                <p className="text-muted mb-2">
                  <strong>Time:</strong> {new Date(request.time).toLocaleString()}
                </p>
                <div className="d-flex justify-content-end gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-success btn-sm"
                    onClick={() => acceptRequest(request)}
                  >
                    Accept
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-danger btn-sm"
                    onClick={()=>navigate(`/message/${request.sender}`)}
                  >
                    Decline
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>

  );
  }
  
};

export default Notification;
