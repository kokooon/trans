import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
    username: string;
    email: string;
  }


  export const UseForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Données envoyées avec succès !');
      } else {
        const errorData = await response.json();
        console.error('Échec de l\'envoi des données:', errorData.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Envoyer</button>
      </form>
  );
  }