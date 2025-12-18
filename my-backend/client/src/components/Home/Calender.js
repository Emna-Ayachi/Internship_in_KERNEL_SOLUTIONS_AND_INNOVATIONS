import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({ id: '', function: '' });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);


  const handleDateClick = async (e) => {
    const today = e.date.toISOString().split('T')[0];
    const start = `${today}T${prompt('Enter start time (e.g. 14:00)')}`;
    const end = `${today}T${prompt('Enter end time (e.g. 15:30)')}`;
    if (!start || !end) return;
    try {
      const response = await fetch('http://localhost:5000/api/mentorTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          user: user.id,
          start_time: start,
          end_time: end,
          money: 5,
        }),
      });
      const data = await response.json();
      localStorage.setItem('eventId', data._id);
      if (response.ok) {
        alert('Mentor time set successfully!');
        setEvents((prev) => [
          ...prev,
          {
            id: data._id,
            start: data.start_time,
            end: data.end_time,
            title: 'Mentor Time',
            backgroundColor: '#007BFF',
            textColor: '#ffffff',
            editable: true,
            extendedProps: { money: data.money },
          },
        ]);
      } else {
        alert('Failed to save mentor time.');
        console.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (!user.id) return;
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        let combinedData = [];
        if (user.function === 'mentor') {
          const [mentorRes, acceptedRes] = await Promise.all([
            fetch('http://localhost:5000/api/mentorTime', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5000/api/accepted', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const mentorJson = await mentorRes.json();
          const acceptedJson = await acceptedRes.json();
          if (!mentorRes.ok) throw new Error(mentorJson.error || 'Failed to fetch mentor time');
          if (!acceptedRes.ok) throw new Error(acceptedJson.error || 'Failed to fetch accepted sessions');

          const mentorEvents = mentorJson.data.map((evt) => ({
            id: evt._id,
            start: evt.start_time,
            end: evt.end_time,
            title: 'Mentor Time',
            backgroundColor: '#007BFF',
            textColor: '#ffffff',
            editable: true,
            extendedProps: { money: evt.money },
          }));

          const acceptedEvents = acceptedJson.data.map((req) => ({
            id: req._id,
            start: req.time,
            end: req.time,
            title: req.subject,
            backgroundColor: '#28a745',
            textColor: '#ffffff',
            editable: true,
            extendedProps: {
              studentName: `${req.sender?.name || ''} ${req.sender?.surname || ''}`.trim(),
              subject: req.subject,
            },
          }));

          combinedData = [...mentorEvents, ...acceptedEvents];
        } else {
          // For students, just fetch accepted sessions
          const res = await fetch('http://localhost:5000/api/accepted', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const json = await res.json();
          if (!res.ok) throw new Error(json.error || 'Failed to fetch student events');

          combinedData = json.data.map((req) => ({
            id: req._id,
            start: req.time,
            end: req.time,
            title: req.subject,
            backgroundColor: '#28a745',
            textColor: '#ffffff',
            editable: false,
            extendedProps: {
              mentorId: req.receiver?._id,
              mentorName: `${req.receiver?.name || ''} ${req.receiver?.surname || ''}`.trim(),
              subject: req.subject,
            },
          }));
        }

        setEvents(combinedData);
      } catch (err) {
        console.error(err.message);
      }
    };


    fetchData();
  }, [user.id, user.function]);

  const handleEventDrop = async (eventId) => {
    if (!eventId) {
      console.error('Invalid event ID');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/mentorTime/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      if (response.ok) {
        alert('Mentor time deleted successfully!');
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      } else {
        alert('Failed to delete mentor time.');
        console.error(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calendarStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-center"
      >
        <h2 className="text-primary">My Appointments Calendar</h2>
        <p className="text-muted">
          {user.function === 'mentor'
            ? 'Click a date to set your availability with start and end time.'
            : 'View your scheduled appointments below.'}
        </p>
      </motion.div>

      <div style={calendarStyles}>
        <FullCalendar
          eventContent={(arg) => {
            const event = arg.event;
            const { mentorName, subject } = event.extendedProps;

            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>{subject || event.title}</b>
                  {mentorName && <div style={{ fontSize: '0.8em' }}>{mentorName}</div>}
                  <div>{arg.timeText}</div>
                </div>
                {user.function === 'mentor' && (
                  <Trash2
                    size={16}
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                    onClick={() => handleEventDrop(event.id)}
                  />
                )}
              </div>
            );
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={user.function === 'mentor' ? 'timeGridWeek' : 'dayGridMonth'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          events={events}
          editable={user.function === 'mentor'}
          selectable={user.function === 'mentor'}
          selectMirror={true}
          dayMaxEvents={true}
          dateClick={user.function === 'mentor' ? handleDateClick : null}
          eventDrop={user.function === 'mentor' ? handleEventDrop : null}
          eventResize={user.function === 'mentor' ? handleEventDrop : null}
          eventColor="#007BFF"
          eventTextColor="#ffffff"
        />
      </div>
    </div>
  );
};

export default CalendarPage;