// src/app/common/user.ts

export interface User {
    matricule: number; // sera 0 ou null pour la création
    firstName: string;
    lastName: string;
    photoUrl?: string; // Optionnel
    position?: string; 
    isActivated: boolean;
    note?: number; 
    grade: string;
    // Ajout des champs pour la création/mise à jour
    username?: string; 
    email: string;
    password?: string; // Requis à la création
    companyName?: string;
    phoneNumber?: string;
    country?: string;
}

export interface Grade {
    label: string;
    value: string;
}

export interface Position {
    label: string;
    value: string;
}

export interface FirstNameOption {
    // label est affiché dans la liste du filtre (ex: "Jean Dupont")
    label: string; 
    // value est ce qui est envoyé au backend (ex: "Jean")
    value: string; 
    // Ajout explicite de photoUrl, firstName, et lastName pour la compatibilité avec le template
    photoUrl?: string; 
    firstName: string; // ✅ CORRECTION: Ajout
    lastName: string; // ✅ CORRECTION: Ajout
}

// Interface de réponse brute de l'API (pour le service)
export interface PaginatedUsers {
    content: UserListProjection[]; 
    number: number; // Page actuelle
    size: number; // Taille de la page
    totalElements: number; // Nombre total d'éléments
    totalPages: number;
}

/**
 * Projection utilisée pour la liste paginée des utilisateurs
 */
export interface UserListProjection {
    matricule: number;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    isActivated: boolean;
    grade: string;
    position?: string;
    note?: number;
}

// Interface de réponse paginée de l'API
export interface PaginatedUsers {
    content: UserListProjection[]; 
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
