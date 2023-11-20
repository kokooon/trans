import React, { useState, ChangeEvent, FormEvent }  from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';

interface FormData {
	username: string;
	email: string;
  }
  
  const App: React.FC = () => {
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
		const response = await fetch('http://localhost:3001/register', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(formData),
		});
  
		if (response.ok) {
		  console.log('Données envoyées avec succès !');
		} else {
		  console.error('Échec de l\'envoi des données.');
		}
	  } catch (error) {
		console.error('Erreur lors de l\'envoi des données :', error);
	  }
	};
  
	return (
	  <React.StrictMode>
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
	  </React.StrictMode>
	);
  };
  
  const root = createRoot(document.getElementById('root')!); // Assurez-vous que votre élément racine a un ID "root"
  root.render(<App />);