import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addons, Addon } from '../data/addons';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Icon from '../components/Icon';

const Addons = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Add-ons</h1>
        <button className="btn btn-primary" onClick={() => navigate('/addons/new')}>
          <Icon component={FiPlus} className="me-2" />
          Add Add-on
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addons.map((addon: Addon) => (
                <tr key={addon.id}>
                  <td>{addon.id}</td>
                  <td>{addon.name}</td>
                  <td>${addon.price}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      <Icon component={FiEdit} className="me-1" />
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <Icon component={FiTrash2} className="me-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default Addons;