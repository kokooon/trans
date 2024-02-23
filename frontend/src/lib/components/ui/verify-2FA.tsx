import React, { useState, ChangeEvent, FormEvent } from 'react';

interface VerificationPageProps {
  onSubmit: (twoFactorCode: string) => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onSubmit }) => {
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Effectuez la requête POST avec la fonction fetch
      const response = await fetch('http://10.13.1.5:3001/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ twoFactorCode }),
      });

      // Vérifiez si la réponse est réussie (statut 2xx)
      if (response.ok) {
        // Si la requête réussit, exécutez l'action fournie par la prop onSubmit
        onSubmit(twoFactorCode);
      } else {
        // Gérez les erreurs, par exemple, affichez un message d'erreur à l'utilisateur
        console.error('Error verifying 2FA:', response.statusText);
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTwoFactorCode(e.target.value);
  };

  return (
    <div>
      <h1>Two-Factor Authentication Verification</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="twoFactorCode">Enter your 2FA code:</label>
        <input
          type="text"
          id="twoFactorCode"
          value={twoFactorCode}
          onChange={handleChange}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerificationPage;