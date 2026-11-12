import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Bell,
  Search,
  Plus,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  X,
  Menu,
  Ticket,
  Activity,
  Settings,
  LogOut,
  AlertCircle,
  CalendarClock,
} from "lucide-react";
import "./App.css";

const subjects = [
  "DSA",
  "OOP",
  "Web Development",
  "Discrete Mathematics",
  "OS",
  "Other",
];

const initialFaculty = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    department: "Computer Science",
    subject: "DSA",
    room: "Block A · 302",
    hours: "10:00 AM – 12:00 PM",
    available: true,
    duration: 10,
    initials: "AS",
    color: "purple",
  },
  {
    id: 2,
    name: "Prof. Rahul Mehta",
    department: "Computer Science",
    subject: "OOP",
    room: "Block B · 214",
    hours: "11:00 AM – 1:00 PM",
    available: true,
    duration: 12,
    initials: "RM",
    color: "blue",
  },
  {
    id: 3,
    name: "Dr. Priya Kapoor",
    department: "Mathematics",
    subject: "Discrete Mathematics",
    room: "Block C · 105",
    hours: "2:00 PM – 4:00 PM",
    available: false,
    duration: 15,
    initials: "PK",
    color: "orange",
  },
  {
    id: 4,
    name: "Prof. Arjun Verma",
    department: "Computer Science",
    subject: "Web Development",
    room: "Block A · 408",
    hours: "12:00 PM – 2:00 PM",
    available: true,
    duration: 10,
    initials: "AV",
    color: "green",
  },
  {
    id: 5,
    name: "Dr. Neha Singh",
    department: "Computer Science",
    subject: "OS",
    room: "Block D · 201",
    hours: "3:00 PM – 5:00 PM",
    available: true,
    duration: 15,
    initials: "NS",
    color: "pink",
  },
];

const initialQueue = [
  {
    id: 101,
    student: "Aarav Malhotra",
    initials: "AM",
    facultyId: 1,
    subject: "DSA",
    question: "Help with binary search",
    status: "Waiting",
    joined: "10:12 AM",
  },
  {
    id: 102,
    student: "Ishita Verma",
    initials: "IV",
    facultyId: 1,
    subject: "DSA",
    question: "Understanding recursion",
    status: "Waiting",
    joined: "10:16 AM",
  },
  {
    id: 103,
    student: "Rohan Gupta",
    initials: "RG",
    facultyId: 2,
    subject: "OOP",
    question: "Virtual functions clarification",
    status: "Waiting",
    joined: "10:18 AM",
  },
  {
    id: 104,
    student: "Meera Joshi",
    initials: "MJ",
    facultyId: 4,
    subject: "Web Development",
    question: "React state management",
    status: "Waiting",
    joined: "10:20 AM",
  },
  {
    id: 105,
    student: "Kabir Sethi",
    initials: "KS",
    facultyId: 1,
    subject: "DSA",
    question: "Graph traversal question",
    status: "Waiting",
    joined: "10:23 AM",
  },
];

function App() {
  const [page, setPage] = useState("Overview");
  const [faculty, setFaculty] = useState(initialFaculty);
  const [queue, setQueue] = useState(initialQueue);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [myQueueId, setMyQueueId] = useState(null);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const waiting = queue.filter((q) => q.status === "Waiting");
  const serving = queue.filter((q) => q.status === "Serving");

  const getFacultyQueue = (facultyId) =>
    queue.filter(
      (q) =>
        q.facultyId === facultyId &&
        ["Waiting", "Serving"].includes(q.status)
    );

  const getWaitTime = (facultyId, studentId = null) => {
    const activeQueue = getFacultyQueue(facultyId);

    const position = studentId
      ? activeQueue.findIndex((q) => q.id === studentId)
      : activeQueue.length;

    const facultyMember = faculty.find((f) => f.id === facultyId);

    return Math.max(0, position) * (facultyMember?.duration || 10);
  };

  const joinQueue = (facultyId, subject, question) => {
    const id = Date.now();

    const newStudent = {
      id,
      student: "You",
      initials: "YO",
      facultyId,
      subject,
      question: question || "General academic question",
      status: "Waiting",
      joined: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setQueue((prev) => [...prev, newStudent]);
    setMyQueueId(id);
    setModal(null);
    notify("You've successfully joined the queue!");
    setPage("My Queue");
  };

  const leaveQueue = () => {
    setQueue((prev) => prev.filter((q) => q.id !== myQueueId));
    setMyQueueId(null);
    notify("You've left the queue.");
  };

  const serveNext = (facultyId) => {
    const currentServing = queue.find(
      (q) => q.facultyId === facultyId && q.status === "Serving"
    );

    const next = queue.find(
      (q) => q.facultyId === facultyId && q.status === "Waiting"
    );

    if (!next) {
      notify("No students are waiting.");
      return;
    }

    setQueue((prev) =>
      prev.map((q) => {
        if (currentServing && q.id === currentServing.id) {
          return { ...q, status: "Completed" };
        }

        if (q.id === next.id) {
          return { ...q, status: "Serving" };
        }

        return q;
      })
    );

    notify(`Now serving ${next.student}`);
  };

  const completeStudent = (facultyId) => {
    const currentServing = queue.find(
      (q) => q.facultyId === facultyId && q.status === "Serving"
    );

    if (!currentServing) {
      notify("No appointment is currently being served.");
      return;
    }

    setQueue((prev) =>
      prev.map((q) =>
        q.id === currentServing.id ? { ...q, status: "Completed" } : q
      )
    );

    notify("Appointment marked as completed.");
  };

  const toggleAvailability = (id) => {
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, available: !f.available } : f))
    );

    notify("Faculty availability updated.");
  };

  const filteredFaculty = faculty.filter((f) =>
    `${f.name} ${f.subject} ${f.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const myEntry = queue.find((q) => q.id === myQueueId);
  const myFaculty = myEntry
    ? faculty.find((f) => f.id === myEntry.facultyId)
    : null;

  const myPosition = myEntry
    ? getFacultyQueue(myEntry.facultyId).findIndex(
        (q) => q.id === myEntry.id
      ) + 1
    : 0;

  const nav = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Faculty Directory", icon: Users },
    { label: "My Queue", icon: Ticket },
    { label: "Faculty Dashboard", icon: GraduationCap },
  ];

  const pageHeader = {
    Overview: [
      "Good afternoon, Vivan 👋",
      "Your campus office-hour hub. Get academic help without the hallway wait.",
    ],
    "Faculty Directory": [
      "Faculty Directory",
      "Find your faculty member and join their office-hour queue.",
    ],
    "My Queue": [
      "Your Queue",
      "Keep track of your place and appointment status.",
    ],
    "Faculty Dashboard": [
      "Faculty Dashboard",
      "Manage availability and simulate student appointments.",
    ],
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Ticket size={23} />
          </div>

          <div>
            <strong>
              Queue<span>Wise</span>
            </strong>
            <small>Campus office hours</small>
          </div>
        </div>

        <div className="campus-card">
          <div className="campus-logo">T</div>

          <div>
            <strong>Thapar University</strong>
            <span>Student workspace</span>
          </div>

          <ChevronRight size={15} />
        </div>

        <div className="nav-caption">MENU</div>

        <nav>
          {nav.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => {
                setPage(item.label);
                setMobileMenu(false);
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>

              {item.label === "My Queue" && myEntry && (
                <span className="nav-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Activity size={18} />
            <strong>QueueWise tip</strong>
            <p>
              Join a queue before heading to the faculty office to save time.
            </p>
          </div>

          <div className="profile">
            <div className="profile-avatar">VG</div>

            <div>
              <strong>Vivan Garg</strong>
              <span>Student · Semester 3</span>
            </div>

            <button onClick={() => notify("Settings coming soon")}>
              <Settings size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <Menu size={20} />
          </button>

          <div className="crumb">
            Campus <ChevronRight size={14} /> <strong>{page}</strong>
          </div>

          <div className="top-right">
            <div className="top-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search faculty..."
              />
            </div>

            <button
              className="bell"
              onClick={() => notify("You're all caught up!")}
            >
              <Bell size={18} />
              <i />
            </button>

            <div className="top-profile">VG</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">QUEUEWISE · STUDENT PORTAL</span>
              <h1>{pageHeader[page][0]}</h1>
              <p>{pageHeader[page][1]}</p>
            </div>

            {page !== "Faculty Dashboard" && !myEntry && (
              <button className="primary-btn" onClick={() => setModal("join")}>
                <Plus size={17} /> Join a queue
              </button>
            )}
          </div>

          {/* OVERVIEW */}
          {page === "Overview" && (
            <>
              <div className="hero">
                <div className="hero-content">
                  <span className="hero-tag">
                    <Activity size={14} /> SMART CAMPUS EXPERIENCE
                  </span>

                  <h2>
                    Less waiting.
                    <br />
                    <span>More learning.</span>
                  </h2>

                  <p>
                    Get academic guidance on your schedule. Find faculty, join a
                    virtual queue, and know exactly when it's your turn.
                  </p>

                  <button
                    className="hero-btn"
                    onClick={() => setPage("Faculty Directory")}
                  >
                    Find faculty <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="hero-visual">
                  <div className="hero-clock">
                    <Clock size={25} />
                    <div>
                      <strong>10–15 min</strong>
                      <span>Average wait today</span>
                    </div>
                  </div>

                  <div className="floating-ticket">
                    <Ticket size={18} />
                    <div>
                      <strong>Queue #QW024</strong>
                      <span>You're almost there!</span>
                    </div>
                    <CheckCircle2 size={18} />
                  </div>

                  <div className="hero-orbit orbit1" />
                  <div className="hero-orbit orbit2" />
                  <div className="hero-emoji">⏱️</div>
                </div>
              </div>

              <div className="stats-grid">
                <Stat
                  icon={<Users />}
                  label="Students waiting"
                  value={waiting.length}
                  note="Across all faculty"
                  color="purple"
                />

                <Stat
                  icon={<GraduationCap />}
                  label="Faculty available"
                  value={faculty.filter((f) => f.available).length}
                  note={`Out of ${faculty.length} faculty`}
                  color="green"
                />

                <Stat
                  icon={<Clock />}
                  label="Avg. wait time"
                  value="12 min"
                  note="Across active queues"
                  color="orange"
                />

                <Stat
                  icon={<CheckCircle2 />}
                  label="Appointments served"
                  value={queue.filter((q) => q.status === "Completed").length}
                  note="Today · simulated"
                  color="blue"
                />
              </div>

              <div className="section-title">
                <div>
                  <h2>Faculty available now</h2>
                  <p>Find the right person for your question</p>
                </div>

                <button
                  className="link-btn"
                  onClick={() => setPage("Faculty Directory")}
                >
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="faculty-grid">
                {faculty
                  .filter((f) => f.available)
                  .slice(0, 3)
                  .map((f) => (
                    <FacultyCard
                      key={f.id}
                      faculty={f}
                      count={getFacultyQueue(f.id).length}
                      wait={getWaitTime(f.id)}
                      onJoin={() => setModal({ faculty: f })}
                    />
                  ))}
              </div>

              <div className="lower-grid">
                <section className="panel">
                  <div className="panel-title">
                    <div>
                      <h2>Live queue activity</h2>
                      <p>What's happening across campus</p>
                    </div>

                    <span className="live-badge">
                      <i /> LIVE
                    </span>
                  </div>

                  {queue
                    .filter((q) => q.status !== "Completed")
                    .slice(0, 4)
                    .map((q) => (
                      <QueueRow
                        key={q.id}
                        entry={q}
                        faculty={faculty.find((f) => f.id === q.facultyId)}
                      />
                    ))}

                  {queue.filter((q) => q.status !== "Completed").length ===
                    0 && <Empty text="No active queue activity" />}
                </section>

                <section className="panel schedule-panel">
                  <div className="panel-title">
                    <div>
                      <h2>Office hours today</h2>
                      <p>Upcoming faculty availability</p>
                    </div>

                    <CalendarClock size={18} />
                  </div>

                  {faculty.slice(0, 4).map((f) => (
                    <div className="schedule-row" key={f.id}>
                      <div
                        className={`schedule-dot ${f.available ? "on" : "off"}`}
                      />

                      <div>
                        <strong>{f.name}</strong>
                        <span>{f.hours}</span>
                      </div>

                      <span
                        className={`availability ${
                          f.available ? "available" : "unavailable"
                        }`}
                      >
                        {f.available ? "Available" : "Offline"}
                      </span>
                    </div>
                  ))}
                </section>
              </div>
            </>
          )}

          {/* FACULTY DIRECTORY */}
          {page === "Faculty Directory" && (
            <>
              <div className="filter-bar">
                <div className="search-input">
                  <Search size={17} />

                  <input
                    placeholder="Search by faculty, subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>

              <div className="faculty-grid directory-grid">
                {filteredFaculty
                  .filter(
                    (f) =>
                      filter === "All" ||
                      (filter === "Available" ? f.available : !f.available)
                  )
                  .map((f) => (
                    <FacultyCard
                      key={f.id}
                      faculty={f}
                      count={getFacultyQueue(f.id).length}
                      wait={getWaitTime(f.id)}
                      onJoin={() => setModal({ faculty: f })}
                    />
                  ))}
              </div>
            </>
          )}

          {/* MY QUEUE */}
          {page === "My Queue" && (
            <>
              {myEntry ? (
                <div className="my-queue-layout">
                  <section className="panel queue-ticket">
                    <div className="ticket-top">
                      <span className="ticket-label">
                        <Ticket size={15} /> YOUR QUEUE TICKET
                      </span>

                      <span
                        className={`status-pill ${myEntry.status.toLowerCase()}`}
                      >
                        {myEntry.status}
                      </span>
                    </div>

                    <div className="ticket-number">
                      QW<span>{String(myQueueId).slice(-4)}</span>
                    </div>

                    <p className="ticket-subtitle">
                      Keep this ticket handy. You'll be notified when your turn
                      is approaching.
                    </p>

                    <div className="ticket-progress">
                      <div className="ticket-progress-top">
                        <span>Queue progress</span>

                        <strong>
                          {myEntry.status === "Serving"
                            ? "It's your turn!"
                            : `${Math.max(0, myPosition - 1)} ahead of you`}
                        </strong>
                      </div>

                      <div className="progress-track">
                        <div
                          style={{
                            width:
                              myEntry.status === "Serving"
                                ? "100%"
                                : `${Math.max(8, 100 - (myPosition - 1) * 20)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="ticket-details">
                      <div>
                        <span>Faculty</span>
                        <strong>{myFaculty?.name}</strong>
                      </div>

                      <div>
                        <span>Subject</span>
                        <strong>{myEntry.subject}</strong>
                      </div>

                      <div>
                        <span>Queue position</span>
                        <strong>
                          {myEntry.status === "Serving"
                            ? "Now serving"
                            : `#${myPosition}`}
                        </strong>
                      </div>

                      <div>
                        <span>Estimated wait</span>
                        <strong>
                          {myEntry.status === "Serving"
                            ? "Now"
                            : `${getWaitTime(myEntry.facultyId, myQueueId)} min`}
                        </strong>
                      </div>
                    </div>

                    {myEntry.status === "Serving" ? (
                      <div className="serving-alert">
                        <CheckCircle2 size={20} />

                        <div>
                          <strong>It's your turn!</strong>
                          <p>Please head to {myFaculty?.room} now.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="wait-alert">
                        <Clock size={20} />

                        <div>
                          <strong>You're in the queue</strong>
                          <p>
                            Estimated wait:{" "}
                            {getWaitTime(myEntry.facultyId, myQueueId)} minutes.
                            Please be nearby.
                          </p>
                        </div>
                      </div>
                    )}

                    <button className="secondary-btn leave-btn" onClick={leaveQueue}>
                      <LogOut size={16} /> Leave queue
                    </button>
                  </section>

                  <section className="panel queue-side">
                    <div className="panel-title">
                      <div>
                        <h2>Queue status</h2>
                        <p>Your appointment journey</p>
                      </div>
                    </div>

                    <div className="timeline">
                      <div className="timeline-step done">
                        <span>
                          <CheckCircle2 size={17} />
                        </span>

                        <div>
                          <strong>Joined queue</strong>
                          <p>{myEntry.joined}</p>
                        </div>
                      </div>

                      <div
                        className={`timeline-step ${
                          myEntry.status === "Serving" ? "done" : "current"
                        }`}
                      >
                        <span>
                          {myEntry.status === "Serving" ? (
                            <CheckCircle2 size={17} />
                          ) : (
                            <Circle size={17} />
                          )}
                        </span>

                        <div>
                          <strong>Waiting for faculty</strong>
                          <p>
                            {myEntry.status === "Serving"
                              ? "Your turn has arrived"
                              : "You will be called shortly"}
                          </p>
                        </div>
                      </div>

                      <div className="timeline-step">
                        <span>
                          <Circle size={17} />
                        </span>

                        <div>
                          <strong>Appointment complete</strong>
                          <p>After your discussion</p>
                        </div>
                      </div>
                    </div>

                    <div className="faculty-mini">
                      <div className={`faculty-avatar ${myFaculty?.color}`}>
                        {myFaculty?.initials}
                      </div>

                      <div>
                        <strong>{myFaculty?.name}</strong>
                        <span>{myFaculty?.room}</span>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="empty-queue panel">
                  <div className="empty-icon">
                    <Ticket size={30} />
                  </div>

                  <h2>You're not in a queue yet</h2>

                  <p>
                    Find a faculty member, join their virtual queue, and skip
                    the hallway wait.
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => setPage("Faculty Directory")}
                  >
                    <Plus size={17} /> Find faculty
                  </button>
                </div>
              )}

              <section className="panel queue-history">
                <div className="panel-title">
                  <div>
                    <h2>My appointment history</h2>
                    <p>Completed appointments in this session</p>
                  </div>
                </div>

                {queue
                  .filter(
                    (q) => q.id === myQueueId && q.status === "Completed"
                  )
                  .map((q) => (
                    <QueueRow
                      key={q.id}
                      entry={q}
                      faculty={faculty.find((f) => f.id === q.facultyId)}
                    />
                  ))}
              </section>
            </>
          )}

          {/* FACULTY DASHBOARD */}
          {page === "Faculty Dashboard" && (
            <>
              <div className="faculty-dashboard-stats">
                <Stat
                  icon={<Users />}
                  label="Students waiting"
                  value={waiting.length}
                  note="Currently in queue"
                  color="purple"
                />

                <Stat
                  icon={<Activity />}
                  label="Currently serving"
                  value={serving.length}
                  note="Active appointments"
                  color="green"
                />

                <Stat
                  icon={<CheckCircle2 />}
                  label="Completed"
                  value={queue.filter((q) => q.status === "Completed").length}
                  note="Session total"
                  color="blue"
                />
              </div>

              <div className="section-title">
                <div>
                  <h2>Manage faculty queues</h2>
                  <p>Simulate faculty-side queue management</p>
                </div>
              </div>

              <div className="faculty-manage-list">
                {faculty.map((f) => (
                  <div className="faculty-manage-card" key={f.id}>
                    <div className={`faculty-avatar ${f.color}`}>
                      {f.initials}
                    </div>

                    <div className="manage-info">
                      <strong>{f.name}</strong>
                      <span>
                        {f.subject} · {f.room}
                      </span>

                      <span
                        className={`availability ${
                          f.available ? "available" : "unavailable"
                        }`}
                      >
                        {f.available ? "● Available" : "● Offline"} ·{" "}
                        {getFacultyQueue(f.id).length} in queue
                      </span>
                    </div>

                    <button
                      className={`secondary-btn ${
                        f.available ? "" : "offline-btn"
                      }`}
                      onClick={() => toggleAvailability(f.id)}
                    >
                      {f.available ? "Set offline" : "Set available"}
                    </button>

                    <button
                      className="primary-btn"
                      disabled={!f.available}
                      onClick={() => serveNext(f.id)}
                    >
                      Serve next <ChevronRight size={15} />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => completeStudent(f.id)}
                      title="Complete current appointment"
                    >
                      <CheckCircle2 size={17} />
                    </button>
                  </div>
                ))}
              </div>

              <section className="panel all-queue-panel">
                <div className="panel-title">
                  <div>
                    <h2>All student queues</h2>
                    <p>Manage appointments across faculty</p>
                  </div>
                </div>

                {queue
                  .filter((q) => q.status !== "Completed")
                  .map((q) => (
                    <QueueRow
                      key={q.id}
                      entry={q}
                      faculty={faculty.find((f) => f.id === q.facultyId)}
                    />
                  ))}
              </section>
            </>
          )}
        </div>

        <footer>
          <span>QueueWise · Making academic support accessible.</span>
          <span>
            Student life, simplified <span className="heart">♥</span>
          </span>
        </footer>
      </main>

      {modal && (
        <JoinModal
          faculty={modal.faculty || null}
          facultyList={faculty}
          onClose={() => setModal(null)}
          onJoin={joinQueue}
          notify={notify}
        />
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, note, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function FacultyCard({ faculty, count, wait, onJoin }) {
  return (
    <div className="faculty-card">
      <div className="faculty-card-top">
        <div className={`faculty-avatar ${faculty.color}`}>
          {faculty.initials}
        </div>

        <span
          className={`availability ${
            faculty.available ? "available" : "unavailable"
          }`}
        >
          {faculty.available ? "● Available" : "● Offline"}
        </span>
      </div>

      <h3>{faculty.name}</h3>

      <p className="faculty-dept">
        {faculty.department} · {faculty.subject}
      </p>

      <div className="faculty-details">
        <div>
          <Clock size={14} />
          {faculty.hours}
        </div>

        <div>
          <BookOpen size={14} />
          {faculty.room}
        </div>
      </div>

      <div className="faculty-queue-info">
        <div>
          <span>In queue</span>
          <strong>{count} students</strong>
        </div>

        <div>
          <span>Est. wait</span>
          <strong>{faculty.available ? `${wait} min` : "Unavailable"}</strong>
        </div>
      </div>

      <button
        className="primary-btn full-btn"
        disabled={!faculty.available}
        onClick={onJoin}
      >
        {faculty.available ? "Join queue" : "Currently unavailable"}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function QueueRow({ entry }) {
  return (
    <div className="queue-row">
      <div className="student-avatar">{entry.initials}</div>

      <div className="queue-student">
        <strong>{entry.student}</strong>
        <span>{entry.question}</span>
      </div>

      <div className="queue-subject">{entry.subject}</div>

      <span className={`status-pill ${entry.status.toLowerCase()}`}>
        {entry.status}
      </span>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty-small">
      <AlertCircle size={18} />
      {text}
    </div>
  );
}

function JoinModal({ faculty, facultyList, onClose, onJoin, notify }) {
  const [selected, setSelected] = useState(faculty?.id || "");
  const [subject, setSubject] = useState(faculty?.subject || "DSA");
  const [question, setQuestion] = useState("");

  const selectedFaculty = facultyList.find(
    (f) => f.id === Number(selected)
  );

  const submit = (e) => {
    e.preventDefault();

    if (!selectedFaculty?.available) {
      notify("This faculty member is currently unavailable.");
      return;
    }

    onJoin(
      Number(selected),
      subject,
      question || "General academic question"
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Join a faculty queue</h2>
            <p>Tell us what you need help with.</p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <label>
          Faculty member

          <select
            required
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);

              const f = facultyList.find(
                (x) => x.id === Number(e.target.value)
              );

              if (f) {
                setSubject(f.subject);
              }
            }}
          >
            <option value="">Choose faculty...</option>

            {facultyList.map((f) => (
              <option key={f.id} value={f.id} disabled={!f.available}>
                {f.name} — {f.subject}
                {!f.available ? " (Unavailable)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subject / category

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          What do you need help with?

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Briefly describe your question (optional)"
          />
        </label>

        {selectedFaculty && (
          <div className="modal-wait">
            <Clock size={17} />

            <div>
              <strong>
                Estimated wait:{" "}
                {selectedFaculty.duration} min per student
              </strong>

              <span>
                Office hours: {selectedFaculty.hours} · {selectedFaculty.room}
              </span>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            type="submit"
            disabled={!selectedFaculty?.available}
          >
            <Ticket size={16} />
            Join queue
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;