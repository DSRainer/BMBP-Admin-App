import React from 'react';
import { useNavigate } from 'react-router-dom';
import { activities, Activity } from '../data/activities';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Icon from '../components/Icon';

const Activities = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Activities</h1>
        <button className="btn btn-primary" onClick={() => navigate('/activities/new')}>
          <Icon component={FiPlus} className="me-2" />
          Add Activity
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity: Activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.name}</td>
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

export default Activities;