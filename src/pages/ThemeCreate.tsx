import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ThemeCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/themes">Themes</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Add Theme</li>
          </ol>
        </nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={()=>navigate('/themes')}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{ console.log({ name, color }); navigate('/themes'); }}>Save</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Theme Name</label>
              <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Jungle" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Color</label>
              <input type="color" className="form-control form-control-color" value={color} onChange={(e)=>setColor(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCreate;


