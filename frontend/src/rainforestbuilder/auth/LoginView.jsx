import { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Auth.css'; // Adjust path based on actual location of Auth.css

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();


 
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        'http://192.168.1.200:8000/manage-data/login-user/',
        {
          method: 'POST',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email, // Match Django LoginView's expected key
            password: formData.password
          })
        }
      );

      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(rawResponse);
        } catch {
          errorData = { error: `Server returned status ${response.status}` };
        }
        console.log('Login failed:', response.status, errorData.error || 'Unknown error');
        setError(errorData.error || 'Login failed');
        return null;
      }

      // Parse JSON only if response is OK
      const data = JSON.parse(rawResponse);
      const origin = location.state?.from || '/';
      navigate(origin);
      setError(null);
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Fetch Error:', error.message);
      setError(`Network error: ${error.message}`);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};