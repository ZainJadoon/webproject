// src/pages/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


const CustomerDashboard = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token found
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/Customers/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customer info');
        }

        const data = await response.json();
        setCustomerInfo(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer info');
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <Header customerInfo={customerInfo} />
      <div className="dashboard-body">
        <Sidebar />
        <div className="dashboard-content">
          <h2>Welcome to Your Dashboard</h2>
          <p> <strong>Customer Name: </strong> {customerInfo.firstName} {customerInfo.lastName}</p>
          <p><strong>Email: </strong>  {customerInfo.email}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
