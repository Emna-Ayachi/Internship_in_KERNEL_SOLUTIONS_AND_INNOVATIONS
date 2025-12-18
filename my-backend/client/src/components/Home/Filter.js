import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const normalize = (value) =>
  value?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

const getUniqueNormalized = (list, path) => {
  const map = new Map();
  for (let item of list) {
    const raw = path.split('.').reduce((acc, key) => acc?.[key], item);
    const key = normalize(raw);
    if (key && !map.has(key)) {
      map.set(key, raw);
    }
  }
  return Array.from(map.values());
};

const pastelColors = [
  '#f9e5e5', '#e8f0fe', '#e5f9f0', '#fff3e5', '#f3e5f5', '#e5f7ff', '#fff5f5'
];

const Filter = () => {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [inputs, setInputs] = useState({
    search: '',
    uni: '',
    position: '',
    major: '',
    level: ''
  });

  const [options, setOptions] = useState({
    uni: [],
    position: [],
    major: [],
    level: []
  });
  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const results = mentors.filter((mentor) => {
      const nameMatch =
        `${mentor.name} ${mentor.surname}`
          .toLowerCase()
          .includes(inputs.search.toLowerCase());

      const uniMatch =
        !inputs.uni ||
        normalize(mentor.uni?.uni_name) === normalize(inputs.uni);

      const posMatch =
        !inputs.position ||
        normalize(mentor.uni?.position) === normalize(inputs.position);

      const majorMatch =
        !inputs.major ||
        normalize(mentor.major?.major_name) === normalize(inputs.major);

      const levelMatch =
        !inputs.level || mentor.level?.toString() === inputs.level;

      return nameMatch && uniMatch && posMatch && majorMatch && levelMatch;
    });

    setFiltered(results);
  };

  //get the function cause only students can book an appointment
  const [user, setUser] = useState({id:'', function: '' });
    useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const userRes = await fetch('http://localhost:5000/api/users/login/calendar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userRes.ok) throw new Error('Failed to fetch user info');
        const userData = await userRes.json();
        setUser({ id: userData.id, function: userData.function });

        const mentorsRes = await fetch('http://localhost:5000/api/users');
        const mentorData = await mentorsRes.json();
        const allMentors = mentorData.data.filter(user => user.function === 'mentor');

        setMentors(allMentors);
        setFiltered(allMentors);

        setOptions({
          uni: getUniqueNormalized(allMentors, 'uni.uni_name'),
          position: getUniqueNormalized(allMentors, 'uni.position'),
          major: getUniqueNormalized(allMentors, 'major.major_name'),
          level: [...new Set(allMentors.map(m => m.level))].sort((a, b) => a - b),
        });

      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const bookAnApp = (mentorId) =>{
    if (user.function==='student'){
      navigate(`/getapp/${mentorId}`);
    }
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <form className="p-3 border rounded bg-white shadow-sm">
            <h5 className="mb-3">Filters</h5>
            <label className="form-label">Search for a mentor:</label>
            <input
              type="text"
              name="search"
              className="form-control"
              onChange={handleInputChange}
            />

            <label className="form-label">Position</label>
            <select
              name="position"
              className="form-select mb-2"
              onChange={handleInputChange}
            >
              <option value="">All</option>
              {options.position.map((pos, i) => (
                <option key={i} value={pos}>{pos}</option>
              ))}
            </select>

            <label className="form-label">University</label>
            <select
              name="uni"
              className="form-select mb-2"
              onChange={handleInputChange}
            >
              <option value="">All</option>
              {options.uni.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>

            <label className="form-label">Major</label>
            <select
              name="major"
              className="form-select mb-2"
              onChange={handleInputChange}
            >
              <option value="">All</option>
              {options.major.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>

            <label className="form-label">Level</label>
            <select
              name="level"
              className="form-select mb-3"
              onChange={handleInputChange}
            >
              <option value="">All</option>
              {options.level.map((lvl, i) => (
                <option key={i} value={lvl}>{lvl}</option>
              ))}
            </select>

            <button type="button" onClick={applyFilters} className="btn btn-dark">
              Apply
            </button>
          </form>
        </div>

        <div className="col-md-9">
            <div className="row g-4">
            {filtered.map((mentor, index) => (
                <motion.div
                key={index}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                <div
                    className="card h-100 shadow-sm border-0"
                    style={{ backgroundColor: pastelColors[index % pastelColors.length] }}
                >
                    <div className="card-body">
                    <h5 className="card-title">
                        {mentor.name} {mentor.surname}
                    </h5>
                    <p className="card-text">
                        <strong>University:</strong> {mentor.uni?.uni_name || 'N/A'}
                        <br />
                        <strong>Position:</strong> {mentor.uni?.position || 'N/A'}
                        <br />
                        <strong>Major:</strong> {mentor.major?.major_name || 'N/A'}
                        <br />
                        <strong>Level:</strong> {mentor.level || 'N/A'}
                    </p>
                    </div>
                    <div className="card-footer bg-transparent border-0">
                    <button className="btn btn-outline-dark w-100" onClick={() => bookAnApp(mentor._id)}>Book An Appointment</button>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
