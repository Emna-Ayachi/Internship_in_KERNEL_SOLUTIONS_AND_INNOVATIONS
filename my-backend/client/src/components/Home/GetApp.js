import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Card, Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

const GetApp = () => {
  const { mentorId } = useParams();

  const [mentorTimes, setMentorTimes] = useState([]);
  const [mentor, setMentor] = useState({ name: '', surname: '' });
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [requestData, setRequestData] = useState({
    subject: '',
    description: '',
    time: '',
    sender: '',
    receiver: '',
  });

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }
        const studentRes = await fetch('http://localhost:5000/api/users/login/calendar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!studentRes.ok) {
          throw new Error('Failed to fetch student info');
        }

        const studentData = await studentRes.json();
        setStudentId(studentData.id);

        setRequestData((prev) => ({
          ...prev,
          sender: studentData.id,
          receiver: mentorId,
        }));

        const mentorInfoResponse = await fetch(`http://localhost:5000/api/users/${mentorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!mentorInfoResponse.ok) {
          throw new Error('Failed to fetch mentor info');
        }

        const mentorInfoData = await mentorInfoResponse.json();
        setMentor({ name: mentorInfoData.name, surname: mentorInfoData.surname });

        const mentorTimesResponse = await fetch(`http://localhost:5000/api/mentorTime/${mentorId}`);
        const mentorTimesData = await mentorTimesResponse.json();
        if (mentorTimesResponse.ok) {
          setMentorTimes(mentorTimesData.data);
        } else {
          throw new Error(mentorTimesData.error || 'Error fetching mentor times');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [mentorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    
    if (!requestData.subject || !requestData.description || !requestData.time) {
      setError("Please fill all fields");
      return;
    }

    const parsedTime = new Date(requestData.time);
    if (isNaN(parsedTime)) {
      setError("Invalid time format. Please try formats like 'July 9 2025 13:00'");
      return;
    }

    const payload = {
      ...requestData,
      time: parsedTime.toISOString(), 
    };

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const data = await response.json();
      setSuccess(true);
      setRequestData({
        subject: '',
        description: '',
        time: '',
        sender: studentId,
        receiver: mentorId,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-4"
    >
      <Container>
        <motion.h1 
          className="text-center mb-5"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Schedule with {mentor.name} {mentor.surname}
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
              Appointment request sent successfully!
            </Alert>
          </motion.div>
        )}

        <div className="row">
          <div className="col-lg-6 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Available Time Slots</h3>
                </Card.Header>
                <Card.Body>
                  {mentorTimes.length > 0 ? (
                    <ListGroup variant="flush">
                      {mentorTimes.map((time, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListGroup.Item className="py-3">
                            <div className="d-flex justify-content-between">
                              <div>
                                <strong>Start:</strong> {new Date(time.start_time).toLocaleString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="text-success">
                                <strong>${time.money}</strong>
                              </div>
                            </div>
                            <div className="mt-2">
                              <strong>End:</strong> {new Date(time.end_time).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </ListGroup.Item>
                        </motion.div>
                      ))}
                    </ListGroup>
                  ) : (
                    <Alert variant="info">No available times at the moment.</Alert>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </div>

          <div className="col-lg-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h3 className="mb-0">Appointment Request</h3>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={requestData.subject}
                        onChange={handleChange}
                        placeholder="Mathematics 101"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={requestData.description}
                        onChange={handleChange}
                        placeholder="I want to learn more about..."
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Preferred Time</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="time"
                        value={requestData.time}
                        onChange={handleChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Select from available slots or suggest a new time
                      </Form.Text>
                    </Form.Group>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={handleSubmit}
                        className="w-100 py-2"
                      >
                        Send Request
                      </Button>
                    </motion.div>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default GetApp;