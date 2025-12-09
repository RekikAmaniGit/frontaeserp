import { Routes } from '@angular/router';

// 🔑 IMPORTS ACTIVÉS ET CLARIFIÉS
import { authGuard } from './services/auth-guard'; // Le guard de protection

// Composants de l'application (DANS le layout Sakai - Protégés)
import { UserList } from './components/user-list/user-list';
/* import { UserDetails } from './components/user-details/user-details';
import { UserEdit } from './components/user-edit/user-edit';
import { RoleManagement } from './components/role-management/role-management';
import { Evaluation } from './components/evaluation/evaluation';
import { Notification } from './components/notification/notification'; */


// Composants du layout Sakai
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Landing } from './pages/landing/landing';
import { Notfound } from './pages/notfound/notfound';
import { Login } from './components/login/login'; // 🔑 Assurez-vous d'importer le nom correct

// ---------------------------------------------------------------------------------------

export const routes: Routes = [
    
    // 1. ROUTES HORS LAYOUT (Plein Écran, Non Protégées)
    // Ces routes n'affichent PAS la barre latérale ni la TopBar de Sakai.
    { path: 'login', component: Login }, 
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') }, // Routes d'auth secondaires
    
    // 2. ROUTE DE LAYOUT (Sakai Shell) - Protégée
    {
        path: '',
        component: AppLayout,
        // 🔑 Appliquer le guard au parent : Protège TOUS les enfants automatiquement
        canActivate: [authGuard], 
        children: [
            // La route racine (après connexion) redirige vers le tableau de bord
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard }, 
            
            // Routes de Sakai par défaut (à garder ou supprimer selon votre besoin)
            { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./pages/pages.routes') },
            
            // -------------------------------------------------------------
            // VOS ROUTES MÉTIER (Déjà Protégées par le guard parent)
            // -------------------------------------------------------------
            
            // Gestion des utilisateurs
            { path: 'users', component: UserList },
            /* { path: 'users/:id', component: UserDetails },
            { path: 'usersEdit/:id', component: UserEdit },
            
            // Autres Modules
            { path: 'notification', component: Notification },
            { path: 'evaluation', component: Evaluation },
            { path: 'roleManagement', component: RoleManagement },
 */
        ]
    },
    
    // 3. Wildcard : Capture toutes les autres routes inconnues
    // L'ordre est important : Si la route n'est ni 'login', ni 'landing', ni protégée, c'est une 404.
    { path: '**', redirectTo: '/notfound' }
];