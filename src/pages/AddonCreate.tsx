import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddonCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/addons">Add-ons</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Add Add-on</li>
          </ol>
        </nav>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={()=>navigate('/addons')}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{ console.log({ name, price }); navigate('/addons'); }}>Save</button>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <label className="form-label">Add-on Name</label>
              <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Birthday Cake" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddonCreate;


