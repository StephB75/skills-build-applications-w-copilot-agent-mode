import { useEffect, useMemo, useState } from 'react';

const getApiEndpoint = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : '/api/activities/';
  console.log('Activities endpoint:', endpoint);
  return endpoint;
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const endpoint = getApiEndpoint();

  const fetchActivities = () => {
    setLoading(true);
    setError(null);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Activities fetched data:', data);
        const items = data?.results ?? data ?? [];
        setActivities(Array.isArray(items) ? items : [items]);
      })
      .catch((fetchError) => {
        console.error('Activities fetch error:', fetchError);
        setError(fetchError.message || 'Failed to load activities');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    if (!search.trim()) return activities;
    return activities.filter((activity) => {
      const text = `${activity.type || ''} ${activity.date || ''} ${activity.duration || ''} ${activity.user?.name || activity.user || ''}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [activities, search]);

  return (
    <div className="container mt-4">
      <div className="card card-custom shadow-sm">
        <div className="card-header card-header-custom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2 className="h4 mb-1">Activities</h2>
            <p className="mb-0 text-white-50">Browse activity records with filters, refresh, and endpoint details.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light" type="button" onClick={fetchActivities}>
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
              <label className="form-label" htmlFor="activitiesSearch">
                Search activities
              </label>
              <div className="input-group">
                <input
                  id="activitiesSearch"
                  type="search"
                  className="form-control"
                  placeholder="Filter by type, date, or user"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button className="btn btn-secondary" type="button" onClick={() => setSearch('')}>
                  Clear
                </button>
              </div>
            </div>
            <div className="col-md-4 text-md-end align-self-end">
              <span className="badge bg-info text-dark">{filteredActivities.length} records</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading activities...
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <tr key={activity.id || activity._id || index}>
                      <td>{activity.type || 'N/A'}</td>
                      <td>{activity.duration ? `${activity.duration} min` : 'N/A'}</td>
                      <td>{activity.date || 'N/A'}</td>
                      <td>{activity.user?.name ?? activity.user ?? 'Unknown'}</td>
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
                <h5 className="modal-title">Activities API Info</h5>
                <button type="button" className="btn-close" onClick={() => setShowInfo(false)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p>Endpoint:</p>
                <pre>{endpoint}</pre>
                <p>Records loaded: {filteredActivities.length}</p>
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

export default Activities;
