//user.model.tsx
export interface User {
    id: number;
    pseudo: string;
    pseudo42: string;
    password: string;
    email: string;
    fortytwoId: string;
    avatar: string;
    is2FAEnabled: boolean;
    friendRequest: number[];
    friendNotifications: number[];
    friends: number[];
    banlist: number[];
    History: string[];
}