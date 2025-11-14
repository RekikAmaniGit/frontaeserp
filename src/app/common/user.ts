export interface User {
    matricule: number; 
    firstName: string;
    lastName: string;
    photoUrl: string;
    position?: string; 
    isActivated: boolean;
    note?: number; 
    grade: string;
}

export interface GetResponseUsers {
    _embedded: {
        users: User[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}