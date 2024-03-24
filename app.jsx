import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    mathsMark: '',
    physicsMark: '',
    chemistryMark: ''
  });
  const [cutoffMarks, setCutoffMarks] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateCutoffMarks = () => {
    const { mathsMark, physicsMark, chemistryMark } = formData;
    const totalMarks = parseInt(mathsMark) + parseInt(physicsMark) + parseInt(chemistryMark);
    const cutoff = totalMarks / 3; 
    return cutoff;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submit', formData);
      const cutoff = calculateCutoffMarks();
      setCutoffMarks(cutoff.toFixed(2));
      alert('Form submitted successfully!');
      
      setFormData({
        name: '',
        email: '',
        dob: '',
        mathsMark: '',
        physicsMark: '',
        chemistryMark: ''
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Student Details Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label><br />
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

        <label htmlFor="dob">Date of Birth:</label><br />
        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required /><br />

        <label htmlFor="maths">Maths Mark:</label><br />
        <input type="number" id="maths" name="mathsMark" value={formData.mathsMark} onChange={handleChange} min="0" max="100" required /><br />

        <label htmlFor="physics">Physics Mark:</label><br />
        <input type="number" id="physics" name="physicsMark" value={formData.physicsMark} onChange={handleChange} min="0" max="100" required /><br />

        <label htmlFor="chemistry">Chemistry Mark:</label><br />
        <input type="number" id="chemistry" name="chemistryMark" value={formData.chemistryMark} onChange={handleChange} min="0" max="100" required /><br />

        <input type="submit" value="Submit" />
      </form>
      {cutoffMarks && <p>Cutoff Marks: {cutoffMarks}</p>}
    </div>
  );
}

export default App;
