// src/app/components/login/login.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../common/auth-models'; 
import { catchError, throwError } from 'rxjs'; 
import { ToastrService } from 'ngx-toastr'; // Assurez-vous d'avoir installé ngx-toastr

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  
  loginForm!: FormGroup;
  loading: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Si l'utilisateur est déjà connecté, rediriger immédiatement
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/users']); // Ou votre page d'accueil principale
      }
    });

    // Initialisation du formulaire de connexion avec validation
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Getter pour accéder facilement aux champs du formulaire dans le template.
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Gestion de la soumission du formulaire de connexion.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Veuillez entrer vos identifiants.', 'Champs requis');
      return;
    }

    this.loading = true;
    const credentials: LoginRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    // 🔑 Point clé : S'abonner et attendre la fin du flux d'authentification
    this.authService.login(credentials)
      .pipe(
        // Gérer les erreurs de connexion (401, 403, etc.)
        catchError(err => {
          this.loading = false;
          // Afficher un message d'erreur générique ou spécifique
          const errorMessage = err.status === 401 
                             ? 'Identifiants invalides.' 
                             : 'Erreur de connexion au serveur.';
          this.toastr.error(errorMessage, 'Échec de l\'authentification');
          
          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe({
        next: (response) => {
          this.loading = false;
          // Le token est stocké via le .tap() dans le service AVANT cette ligne
          this.toastr.success(`Bienvenue, ${response.username}!`, 'Connexion réussie');
          
          // 🔑 Redirection SÉCURISÉE après le succès du stockage du token
          this.router.navigate(['/users']); 
        },
        error: () => {
          // L'erreur est déjà gérée et affichée dans le catchError
        }
      });
  }
}