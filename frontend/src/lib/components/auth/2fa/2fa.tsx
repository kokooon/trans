export const toggle2FA = async (is2FAEnabled: boolean, setIs2FAEnabled: (isEnabled: boolean) => void) => {
    try {
      const response = await fetch('http://10.13.1.5:3001/users/update-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ is2FAEnabled: !is2FAEnabled }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setIs2FAEnabled(!is2FAEnabled);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  