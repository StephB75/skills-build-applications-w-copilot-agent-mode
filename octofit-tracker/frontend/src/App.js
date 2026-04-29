import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octofitNavbar"
            aria-controls="octofitNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="octofitNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/activities">
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/leaderboard">
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/teams">
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/users">
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/workouts">
                  Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <div className="page-header shadow-sm">
          <h1 className="page-title">OctoFit Tracker</h1>
          <p className="lead">
            Browse activity, team, user, workout, and leaderboard data pulled from the Django REST API.
          </p>
          <p className="mb-0">
            Use the navigation menu above to switch between data views.
          </p>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="card card-custom shadow-sm">
                <div className="card-body">
                  <h2 className="section-title">Welcome to OctoFit Tracker</h2>
                  <p className="card-text">
                    Select a page from the navigation menu to load backend data from the REST API and view it in Bootstrap-styled tables.
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <NavLink className="btn btn-primary" to="/activities">
                      Activities
                    </NavLink>
                    <NavLink className="btn btn-outline-primary" to="/leaderboard">
                      Leaderboard
                    </NavLink>
                    <NavLink className="btn btn-outline-secondary" to="/teams">
                      Teams
                    </NavLink>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
