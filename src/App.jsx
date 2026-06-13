import React, { useState } from "react";

function App() {
  const jobsData = [
    {
      id: 1,
      role: "Frontend Developer",
      company: "Infosys",
      location: "Chennai",
      salary: "5 LPA",
      description: "React.js Developer Required",
    },
    {
      id: 2,
      role: "Java Developer",
      company: "TCS",
      location: "Bangalore",
      salary: "6 LPA",
      description: "Java Full Stack Developer",
    },
    {
      id: 3,
      role: "Python Developer",
      company: "Wipro",
      location: "Hyderabad",
      salary: "4.5 LPA",
      description: "Python & Django Developer",
    },
    {
      id: 4,
      role: "UI/UX Designer",
      company: "Accenture",
      location: "Chennai",
      salary: "5.5 LPA",
      description: "Creative UI Designer Needed",
    },
  ];

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);

  const saveJob = (job) => {
    if (!bookmarks.find((item) => item.id === job.id)) {
      setBookmarks([...bookmarks, job]);
    }
  };

  const filteredJobs = jobsData.filter(
    (job) =>
      job.role.toLowerCase().includes(search.toLowerCase()) &&
      (location === "All" || job.location === location)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "30px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "42px",
          marginBottom: "30px",
        }}
      >
        Job Portal
      </h1>

      {/* Dashboard */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#FFA500",
            padding: "20px",
            borderRadius: "15px",
            width: "220px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            color: "white",
          }}
        >
          <h2>{jobsData.length}</h2>
          <p>Total Jobs</p>
        </div>

        <div
          style={{
            background: "#2196F3",
            padding: "20px",
            borderRadius: "15px",
            width: "220px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            color: "white",
          }}
        >
          <h2>{bookmarks.length}</h2>
          <p>Saved Jobs</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Job Role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "250px",
            borderRadius: "10px",
            border: "none",
          }}
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <option>All</option>
          <option>Chennai</option>
          <option>Bangalore</option>
          <option>Hyderabad</option>
        </select>
      </div>

      {/* Job Listings */}
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Available Jobs
      </h2>

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ color: "#4a47a3" }}>{job.role}</h2>

          <p>
            <strong>Company:</strong> {job.company}
          </p>

          <p>
            <strong>Location:</strong> {job.location}
          </p>

          <p>
            <strong>Salary:</strong> {job.salary}
          </p>

          <p>{job.description}</p>

          <button
            onClick={() => saveJob(job)}
            style={{
              background: "#667eea",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            🔖 Bookmark
          </button>

          <button
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Apply Now
          </button>
        </div>
      ))}

      {/* Saved Jobs */}
      <div
        style={{
          background: "light gray",
          padding: "20px",
          borderRadius: "15px",
          marginTop: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2>Saved Jobs ({bookmarks.length})</h2>

        {bookmarks.length === 0 ? (
          <p>No jobs bookmarked.</p>
        ) : (
          bookmarks.map((job) => (
            <div
              key={job.id}
              style={{
                borderBottom: "1px solid #ccc0c0",
                padding: "10px 0",
              }}
            >
              <h3>{job.role}</h3>
              <p>
                {job.company} - {job.location}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

