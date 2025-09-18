import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ActivityCreate: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/activities">Activities</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Add Activity</li>
          </ol>
        </nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={()=>navigate('/activities')}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{ console.log({ name }); navigate('/activities'); }}>Save</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Activity Name</label>
            <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Magic Show" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCreate;


