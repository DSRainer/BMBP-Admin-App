import React from 'react';
import { useNavigate } from 'react-router-dom';
import { packages, Package } from '../data/packages';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Icon from '../components/Icon';

const Packages = () => {
  const navigate = useNavigate();

  const handleEditClick = (pkg: Package) => {
    navigate(`/packages/${pkg.id}/edit`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Packages</h1>
        <button className="btn btn-primary">
          <Icon component={FiPlus} className="me-2" />
          Add Package
        </button>
      </div>
      <div className="row">
        {packages.map((pkg: Package) => (
          <div className="col-md-6 col-lg-4 mb-4" key={pkg.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{pkg.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">${pkg.price}</h6>
                <p className="card-text">{pkg.description}</p>
                <div>
                  <strong>Activities:</strong>
                  <ul className="list-unstyled">
                    {pkg.activities.map(activity => <li key={activity.id}>- {activity.name}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>Themes:</strong>
                  <div>
                    {pkg.themes.map(theme => (
                      <span key={theme.id} className="badge me-1" style={{ backgroundColor: theme.color, color: '#fff' }}>
                        {theme.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <strong>Add-ons:</strong>
                  <ul className="list-unstyled">
                    {pkg.addons.map(addon => <li key={addon.id}>- {addon.name} (${addon.price})</li>)}
                  </ul>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top-0">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEditClick(pkg)}
                >
                  <Icon component={FiEdit} className="me-1" />
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  <Icon component={FiTrash2} className="me-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Packages;