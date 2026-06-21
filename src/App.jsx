
import React, { useMemo, useRef, useState } from "react";
import "./AppStyles.css";
import jpLogo from "./assets/jp.png";

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

const userProfile = {
  name: "Aishwarya",
  title: "Product Designer",
  location: "Chennai, India",
  email: "aishwarya@example.com",
  status: "Online",
};

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [notifications, setNotifications] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "bot", text: "Hi Aishwarya! Need help finding the perfect job?" },
  ]);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [applicationJob, setApplicationJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    resume: null,
    message: "",
  });
  const [account, setAccount] = useState({
    name: userProfile.name,
    email: userProfile.email,
    title: userProfile.title,
    location: userProfile.location,
  });
  const authVisible = !isLoggedIn && showAuthPanel;
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const audioRef = useRef(null);

  const filteredJobs = useMemo(
    () =>
      jobsData.filter(
        (job) =>
          job.role.toLowerCase().includes(search.toLowerCase()) &&
          (location === "All" || job.location === location)
      ),
    [search, location]
  );

  const totalJobs = jobsData.length;
  const liveJobs = filteredJobs.length;

  const showNotification = (message) => {
    const id = Date.now();
    setNotifications((current) => [...current, { id, message }] );
    if (typeof window !== "undefined") {
      playNotificationSound();
    }
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 4200);
  };

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.12;
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.12);
      oscillator.onended = () => context.close();
    } catch (error) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const saveJob = (job) => {
    if (!bookmarks.find((item) => item.id === job.id)) {
      setBookmarks((current) => [...current, job]);
      showNotification(`Saved ‘${job.role}’ to your bookmarks`);
    } else {
      showNotification(`’${job.role}’ is already bookmarked`);
    }
  };

  const handleApply = (job) => {
    setApplicationJob(job);
    setApplicationData({
      name: account.name,
      email: account.email,
      resume: null,
      message: "",
    });
  };

  const handleApplicationResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setApplicationData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleApplicationSubmit = () => {
    if (!applicationData.name || !applicationData.email || !applicationData.resume) {
      showNotification("Please add your name, email, and resume before applying.");
      return;
    }
    showNotification(`Application sent for ${applicationJob.role}`);
    setApplicationJob(null);
    setApplicationData({ name: "", email: "", resume: null, message: "" });
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    const nextId = chatMessages.length + 1;
    setChatMessages((current) => [
      ...current,
      { id: nextId, sender: "me", text: chatInput.trim() },
    ]);
    setChatInput("");

    window.setTimeout(() => {
      const replyId = nextId + 1;
      setChatMessages((current) => [
        ...current,
        { id: replyId, sender: "bot", text: "Thanks! I’ll keep an eye out for matching roles." },
      ]);
      showNotification("New chat reply available");
    }, 900);
  };

  const handleAuthSubmit = () => {
    if (authMode === "login") {
      if (authData.email && authData.password) {
        setIsLoggedIn(true);
        setShowAuthPanel(false);
        setAccount((prev) => ({ ...prev, email: authData.email, name: authData.name || prev.name }));
        showNotification("Logged in successfully");
      } else {
        showNotification("Please enter email and password");
      }
    } else {
      if (authData.name && authData.email && authData.password) {
        setIsLoggedIn(true);
        setShowAuthPanel(false);
        setAccount({
          name: authData.name,
          email: authData.email,
          title: "New Applicant",
          location: "Not set",
        });
        showNotification("Account created successfully");
      } else {
        showNotification("Please fill all signup fields");
      }
    }
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeMessage(`Resume uploaded: ${file.name}`);
      showNotification("Resume uploaded successfully");
    }
  };

  const handleOtherApplication = (job) => {
    showNotification(`Added ${job.role} to other applications`);
  };

  return (
    <div className="app-shell">
      {menuOpen && (
        <aside className="sidebar">
          <div className="brand">
            <img src={jpLogo} alt="JP" className="brand-mark" />
            <div>
              <h1>Job Portal</h1>
              <p>Talent Dashboard</p>
            </div>
          </div>

          <nav className="menu">
          {[
            { label: "Dashboard", icon: "📊" },
            { label: "Jobs", icon: "💼" },
            { label: "Saved", icon: "🔖" },
            { label: "Chat", icon: "💬" },
            { label: "Profile", icon: "👤" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.label === activeMenu ? "menu-item active" : "menu-item"}
              onClick={() => {
                setActiveMenu(item.label);
                if (item.label === "Chat") {
                  setChatOpen(true);
                }
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

          <div className="profile-card">
            <div className="avatar">A</div>
            <div>
              <p className="profile-name">{userProfile.name}</p>
              <p className="profile-title">{userProfile.title}</p>
              <p className="profile-status">{userProfile.status}</p>
            </div>
          </div>
        </aside>
      )}

      <main className="main-panel">
        <header className="topbar">
          <section>
            <h2>Welcome back, {userProfile.name}</h2>
            <p>Explore new job matches and manage your profile.</p>
          </section>

          <div className="top-actions">
            <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? "Hide Menu" : "Show Menu"}
            </button>
            <div className="search-box">
              <span>🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, skills or companies"
              />
            </div>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>All</option>
              <option>Chennai</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
            </select>
            {!isLoggedIn && !showAuthPanel && (
              <button
                className="auth-open"
                type="button"
                onClick={() => setShowAuthPanel(true)}
              >
                Open Login
              </button>
            )}
            <button className="user-chip" type="button" onClick={() => setActiveMenu("Profile")}> 
              {account.name}
            </button>
          </div>
        </header>

        <div className="notification-banner">
          <div>
            <h3>{liveJobs} jobs available now</h3>
            <p>Showing matches for “{search || "all roles"}” in {location}.</p>
          </div>
          <button type="button" onClick={() => setChatOpen((open) => !open)}>
            {chatOpen ? "Hide chat" : "Open chat"}
          </button>
        </div>

        {activeMenu === "Dashboard" && (
          <>
            <section className="dashboard-grid">
              <article>
                <h4>Total Jobs</h4>
                <strong>{totalJobs}</strong>
              </article>
              <article>
                <h4>Favorites</h4>
                <strong>{bookmarks.length}</strong>
              </article>
              <article>
                <h4>Live Alerts</h4>
                <strong>{notifications.length}</strong>
              </article>
              <article>
                <h4>Location</h4>
                <strong>{location}</strong>
              </article>
            </section>
            <section className="footer-panel">
              <div>
                <h4>Contact</h4>
                <p>Email: contact@jobportal.com</p>
                <p>Phone: +91 98765 43210</p>
              </div>
              <div>
                <h4>Other Applications</h4>
                <button type="button" onClick={() => showNotification("Added application to other apps")}>Add to Other Applications</button>
              </div>
            </section>
          </>
        )}

        {activeMenu === "Jobs" && (
          <section className="job-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div>
                  <h3>{job.role}</h3>
                  <p>{job.description}</p>
                </div>
                <div className="job-meta">
                  <span>{job.company}</span>
                  <span>{job.location}</span>
                  <span>{job.salary}</span>
                </div>
                <div className="job-actions">
                  <button type="button" onClick={() => saveJob(job)}>
                    🔖 Bookmark
                  </button>
                  <button type="button" className="primary" onClick={() => handleApply(job)}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeMenu === "Saved" && (
          <section className="saved-panel">
            <div className="saved-header">
              <div>
                <h3>Saved Jobs</h3>
                <p>{bookmarks.length} bookmarked job(s)</p>
              </div>
              <button type="button" onClick={() => showNotification("Keep building your saved list!")}>Remind Me</button>
            </div>
            {bookmarks.length === 0 ? (
              <p className="empty-state">No jobs bookmarked yet. Save a job to see it here.</p>
            ) : (
              bookmarks.map((job) => (
                <div key={job.id} className="saved-job">
                  <div>
                    <strong>{job.role}</strong>
                    <span>{job.company}</span>
                  </div>
                  <span>{job.location}</span>
                </div>
              ))
            )}
          </section>
        )}

        {activeMenu === "Profile" && (
          <section className="profile-panel">
            <div className="profile-card profile-card-large">
              <div className="avatar">{account.name.charAt(0)}</div>
              <div>
                <p className="profile-name">{account.name}</p>
                <p className="profile-title">{account.title}</p>
                <p className="profile-status">{userProfile.status}</p>
                <p className="profile-detail">Email: {account.email}</p>
                <p className="profile-detail">Location: {account.location}</p>
              </div>
            </div>
            <div className="resume-panel">
              <div className="resume-header">
                <div>
                  <h3>Update Resume</h3>
                  <p>Upload your latest resume for better job matches.</p>
                </div>
                <span>{resumeFile ? resumeFile.name : "No file selected"}</span>
              </div>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              {resumeMessage && <p className="resume-message">{resumeMessage}</p>}
            </div>
          </section>
        )}

        {activeMenu === "Chat" && (
          <section className="chat-page">
            <div className="chat-page-header">
              <h3>Career Chat</h3>
              <p>Use the sidebar Chat menu or floating button to open your chat widget.</p>
              <button type="button" onClick={() => setChatOpen(true)}>Open Chat</button>
            </div>
          </section>
        )}
      </main>

      <button className="chat-toggle" type="button" onClick={() => setChatOpen((open) => !open)}>
        {chatOpen ? "Close Chat" : "Chat"}
      </button>

      {applicationJob && (
        <aside className="apply-panel">
          <div className="apply-header">
            <div>
              <h3>Apply for {applicationJob.role}</h3>
              <p>{applicationJob.company} • {applicationJob.location}</p>
            </div>
            <button type="button" className="auth-close" onClick={() => setApplicationJob(null)}>✕</button>
          </div>
          <div className="apply-fields">
            <input
              type="text"
              placeholder="Full name"
              value={applicationData.name}
              onChange={(e) => setApplicationData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Email"
              value={applicationData.email}
              onChange={(e) => setApplicationData((prev) => ({ ...prev, email: e.target.value }))}
            />
            <label className="file-upload">
              <span>{applicationData.resume ? applicationData.resume.name : "Upload resume"}</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleApplicationResumeUpload} />
            </label>
            <textarea
              placeholder="Add a short cover note"
              value={applicationData.message}
              onChange={(e) => setApplicationData((prev) => ({ ...prev, message: e.target.value }))}
            />
          </div>
          <button type="button" className="primary apply-submit" onClick={handleApplicationSubmit}>
            Submit Application
          </button>
        </aside>
      )}

      {authVisible && (
        <aside className="auth-panel">
          <div className="auth-panel-header">
            <h3>{authMode === "login" ? "Login to your account" : "Create account"}</h3>
            <button type="button" className="auth-close" onClick={() => setShowAuthPanel(false)}>✕</button>
          </div>
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "signup" ? "active" : ""}
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
          </div>
          <div className="auth-fields">
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                value={authData.name}
                onChange={(e) => setAuthData((prev) => ({ ...prev, name: e.target.value }))}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))}
            />
            <button type="button" onClick={handleAuthSubmit} className="auth-submit">
              {authMode === "login" ? "Log In" : "Create Account"}
            </button>
          </div>
        </aside>
      )}

      {chatOpen && (
        <aside className="chat-widget">
          <header>
            <div>
              <span>💬</span>
              <div>
                <p>Career Assistant</p>
                <small>Online</small>
              </div>
            </div>
            <button type="button" onClick={() => setChatOpen(false)}>✕</button>
          </header>

          <div className="chat-messages">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={message.sender === "me" ? "chat-message mine" : "chat-message"}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="chat-input-bar">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
            />
            <button type="button" onClick={handleChatSubmit}>Send</button>
          </div>
        </aside>
      )}

      <div className="toast-container">
        {notifications.map((note) => (
          <div key={note.id} className="toast">
            {note.message}
          </div>
        ))}
      </div>

      <audio ref={audioRef} src="data:audio/wav;base64,UklGRhACAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=" hidden />
    </div>
  );
}

export default App;