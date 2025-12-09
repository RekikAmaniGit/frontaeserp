// src/app/common/auth-models.ts

// Correspond à l'objet que le frontend envoie à /auth/login
export interface LoginRequest {
    username: string;
    password?: string;
}

// Correspond à la réponse (AuthResponse DTO) que le backend retourne
export interface AuthResponse {
    matricule: number;
    username: string;
    email: string;
    roles: string[];
    token: string; // 🔑 Le JWT
}