import { Routes } from '@angular/router';

// Composants de votre application (qui seront DANS le layout Sakai)
import { UserList } from './components/user-list/user-list';
/* import { UserDetails } from './components/user-details/user-details';
import { UserEdit } from './components/user-edit/user-edit';
import { RoleManagement } from './components/role-management/role-management';
import { Evaluation } from './components/evaluation/evaluation'; */

// Composants du layout Sakai
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Landing } from './pages/landing/landing';
import { Notfound } from './pages/notfound/notfound';
/* import { Login } from './components/login/login'; // Assurez-vous d'importer Login correctement
import { authGuard } from '../services/auth-guard'; // Le guard de protection
import { Notification } from './components/notification/notification'; */

// Exporte le tableau de routes principal
export const routes: Routes = [
    
    // 1. ROUTE DE LAYOUT (Sakai Shell)
    // Cette route gère toutes les pages qui doivent afficher la Sidebar et la TopBar.
    {
        path: '',
        component: AppLayout,
        children: [
            // Routes de Sakai par défaut (vous pouvez les supprimer si non nécessaires)
            { path: '', component: Dashboard }, // La page d'accueil par défaut de Sakai
            { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./pages/pages.routes') },
            
            // -------------------------------------------------------------
            // VOS ROUTES MÉTIER (Protégées par authGuard)
            // -------------------------------------------------------------
            
            // Exemple : Rediriger la racine de l'appli protégée vers la liste des utilisateurs si connecté
            // Vous devrez probablement ajuster la logique entre Dashboard et UserList selon votre besoin.
            // { path: '', redirectTo: 'users', pathMatch: 'full', canActivate: [authGuard] },
            
            { 
                path: 'users',
                component: UserList,
               // canActivate: [authGuard] 
            }/* ,
            { 
                path: 'users/:id', 
                component: UserDetails,
                canActivate: [authGuard] 
            },
            { 
                path: 'usersEdit/:id', 
                component: UserEdit,
                canActivate: [authGuard] 
            },
             { 
                path: 'notification', 
                component: Notification,
                canActivate: [authGuard] 
            },
            { path: 'evaluation', component: Evaluation, canActivate: [authGuard] },
            { path: 'roleManagement', component: RoleManagement, canActivate: [authGuard] },
             */

        ]
    },
    
    // 2. ROUTES HORS LAYOUT (Plein Écran)
    // Ces routes n'affichent PAS la barre latérale ni la TopBar de Sakai.
   // { path: 'login', component: Login }, // La page de connexion
    
    // Routes spécifiques de Sakai
    { path: 'landing', component: Landing },
    
    // 3. ROUTES D'ERREUR/REDIRECTION
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
    
    // Redirection vers le login si la route est vide (si non connecté) ou vers 'notfound'
    // Pour gérer la redirection du path: '' de votre ancien routage vers 'login',
    // nous allons utiliser la route du Login comme point d'entrée si aucune autre route ne correspond
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    // Wildcard : capture toutes les autres routes inconnues
    { path: '**', redirectTo: '/notfound' }
];
