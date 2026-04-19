import React, { useState } from 'react';
import axios from 'axios';

const PostProject = () => {
    const [project, setProject] = useState({
        title: '',
        description: '',
        budget: '',
        clientName: ''
    });

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/projects', project);
            alert("Project Posted Successfully!");
        } catch (err) {
            alert("Error: Backend is not running!");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <h2>Post a New Project</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="title" placeholder="Project Title" onChange={handleChange} required style={{padding: '8px'}} />
                <textarea name="description" placeholder="Project Description" onChange={handleChange} required style={{padding: '8px'}} />
                <input type="number" name="budget" placeholder="Budget ($)" onChange={handleChange} required style={{padding: '8px'}} />
                <input type="text" name="clientName" placeholder="Your Name" onChange={handleChange} required style={{padding: '8px'}} />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Post Project
                </button>
            </form>
        </div>
    );
};

export default PostProject;
