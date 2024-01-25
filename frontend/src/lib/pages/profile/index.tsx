import { useEffect } from 'react';
import { UserNav } from '@/lib/components/ui/user-nav';
import { fetchUserDetails, isTokenValid, isUserConnected } from '@/lib/components/utils/UtilsFetch';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const isValid = await isTokenValid();
                if (!isValid) {
                    navigate('/login');
                    return;
                }

                const userData = await fetchUserDetails();

                if (userData[0].is2FAEnabled !== false) {
                    const isConnected = await isUserConnected();
                    console.log(isConnected);
                    if (!isConnected) {
                        navigate('/2fa');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle errors here
            }
        };
        checkToken();
    }, [navigate]);

    return (
        <div>
            <UserNav />
        </div>
    );
}

export default Profile;