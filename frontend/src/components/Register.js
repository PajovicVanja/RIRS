// components/Register.js
import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from '../firebaseClient';
import { db } from '../firebaseClient'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions for creating a document

function Register({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate a token and set it
      const token = await user.getIdToken();
      setToken(token);

      // Add the user to Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      setError('');
    } catch (error) {
      setError(error.message); // Display error message if registration fails
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;
