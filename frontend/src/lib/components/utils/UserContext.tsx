// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context value's shape
interface UserContextValue {
    pseudo: string | null;
    setPseudo: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with a default empty value
const UserContext = createContext<UserContextValue | null>(null);

// Correctly type the UserProvider to accept children
interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [pseudo, setPseudo] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ pseudo, setPseudo }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };




