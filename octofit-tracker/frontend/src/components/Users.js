import { useEffect, useMemo, useState } from 'react';

const getApiEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : '/api/users/';
  console.log('Users endpoint:', endpoint);
  return endpoint;
};

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const endpoint = getApiEndpoint();

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Users fetched data:', data);
        const items = data?.results ?? data ?? [];
        setUsers(Array.isArray(items) ? items : [items]);
      })
      .catch((fetchError) => {
        console.error('Users fetch error:', fetchError);
        setError(fetchError.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter((user) => {
      const text = `${user.name || ''} ${user.email || ''} ${user.team?.name || user.team || ''}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [users, search]);

  return (
    <div className="container mt-4">
      <div className="card card-custom shadow-sm">
        <div className="card-header card-header-custom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 mb-1">Users</h2>
            <p className="mb-0 text-white-50">Browse users from the API with search, refresh, and endpoint details.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light" type="button" onClick={fetchUsers}>
              Refresh
            </button>
            <button className="btn btn-outline-light" type="button" onClick={() => setShowInfo(true)}>
              API Info
            </button>
          </div>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="row gy-3 mb-3">
            <div className="col-md-8">
              <label className="form-label" htmlFor="usersSearch">
                Search users
              </label>
              <div className="input-group">
                <input
                  id="usersSearch"
                  type="search"
                  className="form-control"
                  placeholder="Filter by name, email, or team"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button className="btn btn-secondary" type="button" onClick={() => setSearch('')}>
                  Clear
                </button>
              </div>
            </div>
            <div className="col-md-4 text-md-end align-self-end">
              <span className="badge bg-info text-dark">{filteredUsers.length} users</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user._id || user.email}>
                      <td>{user.name || 'Unknown'}</td>
                      <td>{user.email || 'No email'}</td>
                      <td>{user.team?.name ?? user.team ?? 'None'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <small className="text-muted">
              Endpoint:{' '}
              <a href={endpoint} target="_blank" rel="noreferrer noopener" className="link-secondary">
                {endpoint}
              </a>
            </small>
          </div>
        </div>
      </div>

      {showInfo && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Users API Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowInfo(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p>Endpoint:</p>
                <pre>{endpoint}</pre>
                <p>Total loaded users: {filteredUsers.length}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInfo(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  );
}

export default Users;
