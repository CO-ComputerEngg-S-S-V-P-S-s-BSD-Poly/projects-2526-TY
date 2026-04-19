import React, { useState } from 'react';
import { Search, Filter, Download, Mail, Phone, MapPin, Calendar, User as UserIcon, MessageCircle } from 'lucide-react';

const ContactView = ({ data, searchTerm, setSearchTerm }) => {
  const filteredContacts = data.contacts.filter(contact =>
    contact.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ContactRow = ({ contact }) => {
    return (
      <tr className="order-row" style={{ cursor: 'pointer' }}>
        <td className="order-id">{contact.id}</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span style={{ fontWeight: '500' }}>{contact.name}</span>
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={16} color="#6B7280" />
            {contact.email}
          </div>
        </td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} color="#6B7280" />
            {contact.phone}
          </div>
        </td>
        <td>{contact.subject}</td>
        <td>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} color="#6B7280" />
            {contact.date}
          </div>
        </td>
        <td>
          <span className="status-badge" style={{ 
            backgroundColor: contact.status === 'Replied' ? '#10B98120' : 
                           contact.status === 'Pending' ? '#F59E0B20' : '#3B82F620',
            color: contact.status === 'Replied' ? '#10B981' : 
                   contact.status === 'Pending' ? '#F59E0B' : '#3B82F6'
          }}>
            {contact.status}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="view-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-subtitle">All customer inquiries and messages - Total: {data.contacts.length}</p>
        </div>
        <div className="page-actions">
          <button className="filter-btn">
            <Filter size={18} />
            Filter
          </button>
          <button className="download-btn">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="search-container">
        <Search size={20} />
        <input 
          type="text"
          placeholder="Search by ID, name, email, or subject..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="orders-card">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Contact ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, idx) => (
                  <ContactRow key={idx} contact={contact} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    No contact messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
