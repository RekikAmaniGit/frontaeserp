// src/app/components/user-list/user-list.ts

import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeIcons, SharedModule, FilterMetadata } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ✅ Importation essentielle pour les appels API parallèles (correction TS2304)
import { forkJoin } from 'rxjs'; 

import { UserService } from '../../services/user';
import { FirstNameOption, Grade, Position, User, PaginatedUsers, UserListProjection } from '../../common/user';

import { FileUploadModule } from 'primeng/fileupload';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';

// Type pour typer les résultats de forkJoin, évitant les erreurs de type Observables vs Array
type LookupResults = {
    positions: string[];
    grades: string[];
};

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    RatingModule,
    TagModule,
    TooltipModule,
    DialogModule,
    DividerModule,
    SharedModule,
    ChipModule,
    FileUploadModule, 
    PasswordModule,
    InputMaskModule,
    SelectButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
})
export class UserList implements OnInit {
  @ViewChild('dt') dt!: Table;

  userService = inject(UserService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

  // --- Propriétés d'état de la table
  listUsers = signal<UserListProjection[]>([]);
  selectedUsers: User[] = [];
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  loading = signal<boolean>(true);

  // --- Propriétés du Dialogue (CRUD)
  userDialog: boolean = false;
  user: User = {} as User;
  submitted: boolean = false;

  // --- Data pour les filtres et les listes déroulantes
  cols = [
    { field: 'matricule', header: 'Matricule' },
    { field: 'firstName', header: 'Nom & Prénom' },
    { field: 'position', header: 'Position' },
    { field: 'isActivated', header: 'Actif' },
    { field: 'note', header: 'Note' },
    { field: 'grade', header: 'Grade' },
  ];

  availableFirstNames: FirstNameOption[] = [
    { label: 'Jean Dupont', value: 'Jean', photoUrl: 'assets/images/default-profile.png', firstName: 'Jean', lastName: 'Dupont' },
    { label: 'Marie Curie', value: 'Marie', photoUrl: 'assets/images/default-profile.png', firstName: 'Marie', lastName: 'Curie' },
  ];

  availablePositions: Position[] = [];
  availableGrades: Grade[] = [];
  allGrades: Grade[] = []; // Pour le formulaire de dialogue

  ngOnInit() {
    this.fetchLookups();
    
  }

// --- Logique de chargement paresseux (Lazy Load)
  onPageChange(event: TableLazyLoadEvent) {
    this.thePageNumber = event.first! / event.rows!;
    this.thePageSize = event.rows!;
    
    // Récupère les informations de tri
    const sortField = 
      (typeof event.sortField === 'string' ? event.sortField : undefined);
    
    // Correction: Convertir 'null' en 'undefined'
    const sortOrder: number | undefined = 
      (event.sortOrder !== null && event.sortOrder !== undefined) 
        ? event.sortOrder 
        : undefined;

    // Récupère les filtres
    const filters = event.filters;

    this.handleListUsers(this.thePageNumber, this.thePageSize, filters, sortField, sortOrder);
  }

  handleListUsers(
    page: number = this.thePageNumber,
    size: number = this.thePageSize,
    filters: { [s: string]: (FilterMetadata | FilterMetadata[] | undefined) } | undefined = undefined,
    sortField: string | undefined = undefined,
    sortOrder: number | undefined = undefined
  ) {
    this.loading.set(true);

    let apiFilters: Record<string, any> = {};
    if (filters) {
      apiFilters = this.mapPrimeNgFiltersToApiParams(filters);
    }
    console.log("thiiiis data");
console.log("apiFilters",apiFilters);
console.log("filters",filters);
    this.userService.getUserListPaginate(page, size, apiFilters, sortField, sortOrder).subscribe({
      next: (data: PaginatedUsers) => {
          console.log("tesst");
          console.log("data.content as UserListProjection",data.content as UserListProjection[] || []);
          this.listUsers.set(data.content as UserListProjection[] || []); 
          this.thePageNumber = data.number; // ✅ Accès direct, sans .page
          this.thePageSize = data.size; // ✅ Accès direct, sans .page
          this.theTotalElements = data.totalElements; // ✅ Accès direct, sans .page
          this.loading.set(false);
      },
      error: (err: any) => {
  console.error("Erreur de chargement des utilisateurs :", err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du chargement des utilisateurs: ' + (err.error?.message || err.message),
        });
        this.loading.set(false);
      },
    });
  }

  // --- Mappage des filtres PrimeNG vers les paramètres API
  mapPrimeNgFiltersToApiParams(filters: { [s: string]: (FilterMetadata | FilterMetadata[] | undefined) }): Record<string, any> {
    const apiParams: Record<string, any> = {};

    for (const field in filters) {
      if (filters.hasOwnProperty(field)) {
        const filterInfos = filters[field];

        // Gérer le filtre global (qui est un tableau d'objets)
        if (field === 'global') {
            if (Array.isArray(filterInfos) && filterInfos.length > 0) {
              const value = filterInfos[0]?.value;
              if (value) {
                  apiParams['keyword'] = value;
              }
            }
            continue;
        }

        let value: any = Array.isArray(filterInfos) ? filterInfos[0]?.value : filterInfos?.value;
        let matchMode: string = Array.isArray(filterInfos) ? (filterInfos[0]?.matchMode || '') : (filterInfos?.matchMode || '');
        
        if (value !== null && value !== undefined && value !== '') {
            switch (field) {
                case 'firstName':
                    if (Array.isArray(value) && value.length > 0) apiParams['firstName'] = value.join(',');
                    break;
                case 'matricule':
                    if (matchMode === 'contains') apiParams['matricule'] = value;
                    break;
                case 'position':
                case 'grade':
                    if (matchMode === 'equals') apiParams[field] = value;
                    break;
                case 'isActivated':
                    // Le filtre booléen retourne true/false
                    apiParams['isActivated'] = value.toString();
                    break;
                case 'note':
                    if (matchMode === 'gte') apiParams['note'] = value;
                    break;
            }
        }
      }
    }
    return apiParams;
  }

  // --- CRUD Actions

  openNew() {
    this.user = {
      matricule: 0, 
      firstName: '',
      lastName: '',
      photoUrl: 'assets/images/default-profile.png',
      isActivated: true,
      grade: this.allGrades.length > 0 ? this.allGrades[0].value : '',
      email: '',
      username: '', 
      password: '', 
      position: '',
      note: 0,
      companyName: '', 
      phoneNumber: '',
      country: '',
    };
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: User) {
    // Crée une copie de l'utilisateur pour l'édition et s'assure que les champs requis existent
    this.user = { 
      ...user, 
      username: user.username || '', 
      companyName: user.companyName || '', 
      phoneNumber: user.phoneNumber || '', 
      country: user.country || ''
    };
    this.user.password = ''; // Ne jamais afficher ni envoyer l'ancien mot de passe
    this.userDialog = true;
  }

  saveUser() {
    this.submitted = true;

    // Validation simple (ajoutez une validation complète si nécessaire)
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      return;
    }

    // Cas mise à jour
    if (this.user.matricule > 0) {
      this.userService.updateUser(this.user.matricule, this.user).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur mis à jour',
            life: 3000,
          });
          this.userDialog = false;
          this.handleListUsers();
        },
        error: (err: any) => {
          const backendMessage = err.error?.message || err.message || 'Erreur inconnue';
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Échec de la mise à jour: ' + backendMessage,
          });
        },
      });
      return;
    }

    // Cas création : vérifier d'abord si l'utilisateur existe déjà
    this.userService.checkUserExists(this.user.username, this.user.email).subscribe({
      next: (exists) => {
        if (exists.usernameExists || exists.emailExists) {
          let detail = '';
          if (exists.usernameExists && exists.emailExists) {
            detail = 'Un utilisateur avec ce nom d\'utilisateur et cet email existe déjà.';
          } else if (exists.usernameExists) {
            detail = 'Un utilisateur avec ce nom d\'utilisateur existe déjà.';
          } else if (exists.emailExists) {
            detail = 'Un utilisateur avec cet email existe déjà.';
          }

          this.messageService.add({
            severity: 'warn',
            summary: 'Utilisateur déjà existant',
            detail,
            life: 4000,
          });

          return; // Ne pas créer l'utilisateur
        }

        // Si rien n'existe, on crée l'utilisateur
        if (!this.user.password) {
          this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Le mot de passe est requis pour la création', life: 3000 });
          return;
        }
        
        this.userService.createUser(this.user).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Utilisateur créé',
              life: 3000,
            });
            this.userDialog = false;
            this.handleListUsers();
          },
          error: (err: any) => {
            const backendMessage = err.error?.message || err.message || 'Erreur inconnue';
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Échec de la création: ' + backendMessage,
            });
          },
        });
      },
      error: (err: any) => {
        const backendMessage = err.error?.message || err.message || 'Erreur inconnue';
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de la vérification de l existence de l utilisateur: ' + backendMessage,
        });
      },
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName}?`,
      header: 'Confirmer la suppression',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.userService.deleteUser(user.matricule).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé', life: 3000 });
            this.handleListUsers(); // Recharger les données
          },
          error: (err: any) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression: ' + (err.error?.message || err.message) }),
        });
      },
    });
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?',
      header: 'Confirmer la suppression multiple',
      icon: PrimeIcons.INFO_CIRCLE,
      accept: () => {
        const idsToDelete = this.selectedUsers.map(u => u.matricule);
        this.processBatchDeletes(idsToDelete);
      },
    });
  }

  /**
 * Utilise forkJoin pour exécuter les suppressions en parallèle.
 * C'est une approche plus propre et professionnelle.
 * @param ids Les matricules à supprimer.
 */
  private processBatchDeletes(ids: number[]) {
      if (ids.length === 0) return;

      // Crée un tableau d'Observables de suppression.
      const deleteRequests = ids.map(id => this.userService.deleteUser(id));

      // forkJoin exécute toutes les requêtes en parallèle et attend la résolution de toutes.
      forkJoin(deleteRequests).subscribe({
          next: () => {
              // Succès si toutes les suppressions ont réussi
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Succès', 
                detail: `${ids.length} utilisateur(s) supprimé(s).` 
              });
          },
          error: (err) => {
              // Erreur si au moins une suppression a échoué.
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Erreur Batch', 
                detail: `Échec d'une ou plusieurs suppressions: ` + (err.error?.message || err.message), 
                life: 5000 
              });
          },
          complete: () => {
              this.selectedUsers = [];
              this.handleListUsers();
          }
      });
  }


  // --- Méthodes utilitaires

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  getGradeSeverity(grade: string | undefined): string {
    if (!grade) return 'secondary';
    switch (grade) {
      case 'A_PLUS':
        return 'success';
      case 'B':
        return 'info';
      case 'C_MINUS':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  // Méthode pour l'affichage de l'état d'activation dans un tag
  getSeverity(user: User): string {
    return user.isActivated ? 'success' : 'danger';
  }

  /**
 * Convertit une valeur d'énumération (ex: 'A_PLUS') en un label lisible (ex: 'A Plus').
 * Cette méthode privée centralise la logique de formatage.
 * @param value La valeur de l'énumération.
 * @returns Le label formaté.
 */
  private formatEnumLabel(value: string): string {
      if (!value) return '';
      // Remplace les underscores par des espaces et met la première lettre de chaque mot en majuscule
      return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
  }


  /**
 * Charge les listes de Position et de Grade en appelant les nouveaux endpoints.
 * Utilisation de forkJoin pour un chargement optimisé en parallèle.
 */
fetchLookups() {
    this.loading.set(true);
    // On retire le type générique de forkJoin et on s'appuie sur l'inférence pour l'Observable
    forkJoin({
        positions: this.userService.getPositionsLookup(),
        grades: this.userService.getGradesLookup()
    }).subscribe({
        next: (results: LookupResults) => { 
            // 1. Mappe les positions brutes en objets { label, value }
            this.availablePositions = results.positions.map((value: string) => ({
                label: this.formatEnumLabel(value),
                value: value
            }));

            // 2. Mappe les grades bruts en objets { label, value }
            const gradesMap = results.grades.map((value: string) => ({
                label: this.formatEnumLabel(value),
                value: value
            }));
            
            this.availableGrades = gradesMap;
            this.allGrades = gradesMap;
            this.loading.set(false);

            // Charge la première page des utilisateurs
            this.handleListUsers();
        },
        error: (err: any) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur Chargement Listes',
                detail: 'Échec du chargement des listes de postes/grades: ' + (err.error?.message || 'Erreur inconnue'),
            });
            this.loading.set(false);
            // Si les lookups échouent, nous devrions quand même essayer de charger la liste principale
            this.handleListUsers();
        }
    });
}
}