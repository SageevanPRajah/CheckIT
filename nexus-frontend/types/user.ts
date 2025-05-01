export interface Authority {
    authority: string;
}

export interface User {
    id: number;
    username: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
    password?: string; // Optional
    email?: string; // Optional
    phoneNumber?: string | null; // Optional
    enabled?: boolean; // Optional
    authorities?: Authority[]; // Optional
    accountNonLocked?: boolean; // Optional
    credentialsNonExpired?: boolean; // Optional
    accountNonExpired?: boolean; // Optional
}