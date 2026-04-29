import { useEffect, useMemo, useState } from 'react';

const getApiEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : '/api/leaderboard/';
  console.log('Leaderboard endpoint:', endpoint);
  return endpoint;
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const endpoint = getApiEndpoint();

  const fetchLeaderboard = () => {
    setLoading(true);
    setError(null);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Leaderboard fetched data:', data);
        const items = data?.results ?? data ?? [];
        setEntries(Array.isArray(items) ? items : [items]);
      })
      .catch((fetchError) => {
        console.error('Leaderboard fetch error:', fetchError);
        setError(fetchError.message || 'Failed to load leaderboard');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    return entries.filter((entry) => {
      const text = `${entry.user?.name || entry.user || ''} ${entry.score || ''}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [entries, search]);

  return (
    <div className="container mt-4">
      <div className="card card-custom shadow-sm">
        <div className="card-header card-header-custom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 mb-1">Leaderboard</h2>
            <p className="mb-0 text-white-50">View the top user scores with search, refresh, and modal details.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light" type="button" onClick={fetchLeaderboard}>
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
              <label className="form-label" htmlFor="leaderboardSearch">
                Search leaderboard
              </label>
              <div className="input-group">
                <input
                  id="leaderboardSearch"
                  type="search"
                  className="form-control"
                  placeholder="Filter by user or score"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button className="btn btn-secondary" type="button" onClick={() => setSearch('')}>
                  Clear
                </button>
              </div>
            </div>
            <div className="col-md-4 text-md-end align-self-end">
              <span className="badge bg-info text-dark">{filteredEntries.length} entries</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No leaderboard entries found.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <tr key={entry.id || entry._id || index}>
                      <td>{index + 1}</td>
                      <td>{entry.user?.name ?? entry.user ?? 'Unknown'}</td>
                      <td>{entry.score ?? 'N/A'}</td>
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
                <h5 className="modal-title">Leaderboard API Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowInfo(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p>Endpoint:</p>
                <pre>{endpoint}</pre>
                <p>Total loaded entries: {filteredEntries.length}</p>
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

export default Leaderboard;
