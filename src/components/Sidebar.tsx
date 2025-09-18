
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiPackage, FiActivity, FiGift, FiImage, FiCalendar, FiInbox } from 'react-icons/fi';
import './Sidebar.css';
import Icon from './Icon';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>BMBP Admin</h3>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <Icon component={FiHome} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/enquiries" className="nav-link">
            <Icon component={FiInbox} />
            <span>Enquiries</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/bookings" className="nav-link">
            <Icon component={FiCalendar} />
            <span>Bookings</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/packages" className="nav-link">
            <Icon component={FiPackage} />
            <span>Packages</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/activities" className="nav-link">
            <Icon component={FiActivity} />
            <span>Activities</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/themes" className="nav-link">
            <Icon component={FiImage} />
            <span>Themes</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/addons" className="nav-link">
            <Icon component={FiGift} />
            <span>Add-ons</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
