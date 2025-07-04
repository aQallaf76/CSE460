import React from 'react';
import './StatusBadge.css';

const statusMap = {
  pending: { color: '#ffc107', icon: '⏳', label: 'Pending' },
  preparing: { color: '#17a2b8', icon: '👨‍🍳', label: 'Preparing' },
  ready: { color: '#28a745', icon: '✅', label: 'Ready' },
  completed: { color: '#6c757d', icon: '🎉', label: 'Completed' },
  cancelled: { color: '#dc3545', icon: '❌', label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || statusMap['pending'];
  return (
    <span className="status-badge" style={{ background: s.color + '22', color: s.color }}>
      <span className="status-icon">{s.icon}</span>
      <span className="status-label">{s.label}</span>
    </span>
  );
};

export default StatusBadge; 