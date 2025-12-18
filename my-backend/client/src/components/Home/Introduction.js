import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
const Introduction = () => {
  const [user, setUser] = useState({ name: '', surname: '' });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/users/login/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUser({ name: data.name, surname: data.surname });
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user.name && !user.surname) {
    return <h2>Welcome!</h2>;
  }

  return (
    <motion.h1
      style={{ paddingLeft: '2rem', marginBottom: '2rem' }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      Welcome {user.surname} {user.name}!
    </motion.h1>
  );
};

export default Introduction;
