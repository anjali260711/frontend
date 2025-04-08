// frontend/pages/user.js
import { useState } from 'react';
import axios from 'axios';

export default function UserForm() {
  const [form, setForm] = useState({
    name: '', rollNumber: '', mobile: '', email: '', branch: ''
  });
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/send-otp', { mobile: form.mobile });
      setOtpStage(true);
    } catch (err) {
      setMessage('Failed to send OTP.');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/user/verify-otp', {
        mobile: form.mobile,
        otp
      });
      if (res.data.success) {
        await axios.post('http://localhost:5000/api/user/save', form);
        setVerified(true);
        setMessage('Welcome! Your data has been saved.');
      }
    } catch (err) {
      setMessage('Invalid OTP.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Form</h2>

      {!otpStage ? (
        <>
          <input placeholder="Name" name="name" onChange={handleChange} /><br />
          <input placeholder="Roll Number" name="rollNumber" onChange={handleChange} /><br />
          <input placeholder="Mobile" name="mobile" onChange={handleChange} /><br />
          <input placeholder="Email" name="email" onChange={handleChange} /><br />
          <input placeholder="Branch" name="branch" onChange={handleChange} /><br />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : !verified ? (
        <>
          <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} /><br />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      ) : (
        <p>{message}</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}