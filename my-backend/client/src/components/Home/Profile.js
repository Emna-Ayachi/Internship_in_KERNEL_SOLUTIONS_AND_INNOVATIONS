import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mail: "",
    function: "",
    level: "",
    uni: { uni_name: "", position: "" },
    major: { major_name: "" },
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUser(data.data);
        setFormData(data.data); 
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
    setError("");
  };
  const saveChanges = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");
      const updatedUser = await res.json();
      setUser(updatedUser.data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <motion.div
      className="container py-4"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="card shadow-sm mx-auto"
        style={{ maxWidth: 680 }}
        whileHover={{ translateY: -4, boxShadow: "0 0.5rem 1rem rgba(0,0,0,.15)" }}
      >
        <div className="card-header bg-white border-0">
          <h2 className="h4 mb-0 fw-bold">My Profile</h2>
        </div>

        <div className="card-body">
          <div className="row">
            {/* Basic Info */}
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Name</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.name || "—"}</p>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Surname</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.surname || "—"}</p>
              )}
            </div>

            {/* Email, Function, Level */}
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Email</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="mail"
                  value={formData.mail}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.mail || "—"}</p>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Function</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="function"
                  value={formData.function}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.function || "—"}</p>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Level</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.level || "—"}</p>
              )}
            </div>
          </div>
          <hr />
          <h5 className="fw-semibold mb-3">University</h5>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Name</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="uni.uni_name"
                  value={formData.uni?.uni_name || ""}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.uni?.uni_name || "—"}</p>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Position</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="uni.position"
                  value={formData.uni?.position || ""}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.uni?.position || "—"}</p>
              )}
            </div>
          </div>

          <h5 className="fw-semibold mt-4 mb-3">Major</h5>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label fw-semibold">Name</label>
              {editMode ? (
                <input
                  className="form-control"
                  name="major.major_name"
                  value={formData.major?.major_name || ""}
                  onChange={handleChange}
                />
              ) : (
                <p className="form-control-plaintext">{user.major?.major_name || "—"}</p>
              )}
            </div>
          </div>
          <div className="d-flex gap-3 mt-4">
            {editMode ? (
              <>
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={saveChanges}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  disabled={loading}
                  onClick={toggleEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={toggleEdit}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;