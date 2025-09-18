import React from 'react';
import { useNavigate } from 'react-router-dom';
import { themes, Theme } from '../data/themes';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Icon from '../components/Icon';

const Themes = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Themes</h1>
        <button className="btn btn-primary" onClick={() => navigate('/themes/new')}>
          <Icon component={FiPlus} className="me-2" />
          Add Theme
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme: Theme) => (
                <tr key={theme.id}>
                  <td>{theme.id}</td>
                  <td>{theme.name}</td>
                  <td>
                    <div style={{ width: '30px', height: '30px', backgroundColor: theme.color, borderRadius: '5px' }}></div>
                  </td>
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

export default Themes;