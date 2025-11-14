// src/app/components/user-list/user-list.ts

import { Component, OnInit, signal, inject } from '@angular/core';
import { User } from '../../common/user'; 
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 

// PrimeNG Modules 
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip'; 
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvatarModule } from "primeng/avatar"; 
import { ChipModule } from "primeng/chip";

// Définition des types de gravité acceptés par p-tag
type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

@Component({
  selector: 'app-user-list',
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    TooltipModule,
    SelectModule,
    MultiSelectModule,
    AvatarModule,
    ChipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {

    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    listUsers = signal<User[]>([]);
    loading = signal(true); 
    selectedUsers: User[] | null = null;

    thePageNumber = 1; 
    thePageSize = 10; 
    theTotalElements = 0;

    currentFilters: any = {}; 
    currentSortField: string | undefined = undefined;
    currentSortOrder: number | undefined = undefined;

    // AJOUT : Liste des options statiques pour le filtre "firstName"
    // C'est la liste COMPLETE de tous les prénoms existants (chargee une seule fois)
    availableFirstNames: { label: string, value: string }[] = []; 
    availablePositions: { label: string, value: string | null }[] = [];
    availableGrades: { label: string, value: string | null }[] = [];

    cols = [
        { field: 'matricule', header: 'Matricule' },
        { field: 'firstName', header: 'firstName' },
        { field: 'position', header: 'Position' },
        { field: 'isActivated', header: 'Actif' },
        { field: 'note', header: 'Note' },
        { field: 'grade', header: 'Grade' },
    ];
    
    ngOnInit() {
        // Chargement des options de filtre AVANT le premier chargement de la table
        // Le premier chargement de la table se fait toujours via onPageChange
        this.loadInitialFilterOptions(); 
    }

    /**
     * Charge les options statiques pour les filtres (positions, grades, prénoms).
     * IMPORTANT : Cette fonction DOIT appeler un endpoint API qui renvoie TOUS 
     * les prénoms uniques, positions uniques, etc., et non ceux de la page courante.
     * Pour cette démo, on utilise la liste de la première page pour simuler les options.
     */
    loadInitialFilterOptions(): void {
        // Vous devez implémenter un appel API dédié (ex: this.userService.getAllUniqueField('firstName'))
        // Pour simuler, nous allons extraire les options de la première page une fois qu'elle est chargée.
        // C'est pourquoi nous appelons `extractUnique...` dans le subscribe de `handleListUsers`.
    }

/**
 * Mappe la structure de filtre PrimeNG vers les paramètres de requête simples pour l'API Spring.
 */
mapPrimeNgFiltersToApiParams(filters: any): Record<string, any> {
  const apiParams: Record<string, any> = {};
  if (!filters) return apiParams;

  for (const field in filters) {
    const filterInfos = filters[field];
    let value: any = Array.isArray(filterInfos) ? filterInfos[0]?.value : filterInfos?.value;
    let matchMode: string = Array.isArray(filterInfos) ? filterInfos[0]?.matchMode : filterInfos?.matchMode;

    if (value !== null && value !== undefined && value !== '') {
      switch (field) {
        case 'firstName':
          if (Array.isArray(value) && value.length > 0) apiParams['firstName'] = value.join(',');
          break;
        case 'matricule':
          if (matchMode === 'contains') apiParams['matricule'] = value;
          break;
        case 'position':
          if (matchMode === 'equals') apiParams['position'] = value;
          break;
        case 'grade':
          if (matchMode === 'equals') apiParams['grade'] = value;
          break;
        case 'isActivated':
          apiParams['isActivated'] = value.toString();
          break;
        case 'note':
          if (matchMode === 'gte') apiParams['note'] = value;
          break;
      }
    }
  }
  return apiParams;
}

    /**
     * Charge les utilisateurs en utilisant la pagination, le tri et le filtrage côté serveur.
     */
    handleListUsers() {
  this.loading.set(true);
  const filterParams = this.mapPrimeNgFiltersToApiParams(this.currentFilters);

  this.userService
    .getUserListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      filterParams,
      this.currentSortField,
      this.currentSortOrder
    )
    .subscribe({
      next: (data: any) => {
        this.listUsers.set(data.content); // ✅ Utilise content
        this.thePageNumber = data.number + 1;
        this.thePageSize = data.size;
        this.theTotalElements = data.totalElements;
        this.loading.set(false);

        if (this.availablePositions.length === 0) {
          this.extractUniqueFilters(data.content);
        }
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.',
          life: 3000,
        });
      },
    });
}
    
    /**
     * Gère les événements de lazy loading (pagination, tri, filtre).
     */
    onPageChange(event: TableLazyLoadEvent) { 
        const first: number = event.first ?? 0;
        const rows: number = event.rows ?? this.thePageSize;

        this.thePageNumber = Math.floor(first / rows) + 1; 
        this.thePageSize = rows;
        
        this.currentSortField = event.sortField as (string | undefined);
        this.currentSortOrder = event.sortOrder as (number | undefined);
        this.currentFilters = event.filters;

        this.handleListUsers(); 
    }
    
    /**
     * Gère le filtre global.
     */
    onGlobalFilter(table: Table, event: Event) {
        const searchValue = (event.target as HTMLInputElement).value;
        
        // Utilise la convention 'keyword' pour le filtre global
        this.currentFilters['keyword'] = [{ value: searchValue, matchMode: 'contains' }];
        
        this.thePageNumber = 1; 
        this.handleListUsers();
    }

 extractUniqueFilters(users: User[]): void {
        
        // --- 1. Extraction des Prénoms pour le MultiSelect ---
        // On s'assure que 'name' est bien une string avant de mapper.
        const uniqueFirstNames = Array.from(new Set(
            users.map(u => u.firstName)
            .filter((p): p is string => typeof p === 'string' && p.length > 0)
        ));
        
        this.availableFirstNames = uniqueFirstNames.map(name => ({ 
            label: name, 
            value: name 
        }));

        // --- 2. Correction de l'Extraction des Positions ---
        // On utilise un Type Guard pour garantir que 'pos' est une string non vide.
        const uniquePositions = Array.from(new Set(
            users.map(u => u.position)
            .filter((p): p is string => typeof p === 'string' && p.length > 0)
        ));
        
        this.availablePositions = uniquePositions.map(pos => ({ 
            label: pos, 
            value: pos // 'pos' est garanti d'être string ici
        }));
        this.availablePositions.unshift({ label: 'Tous les postes', value: null });

        // --- 3. Correction de l'Extraction des Grades ---
        // On utilise un Type Guard pour garantir que 'g' est une string non vide.
        const uniqueGrades = Array.from(new Set(
            users.map(u => u.grade)
            .filter((g): g is string => typeof g === 'string' && g.length > 0)
        ));
        
        this.availableGrades = uniqueGrades.map(grade => ({ 
            label: grade, 
            value: grade // 'grade' est garanti d'être string ici
        }));
        this.availableGrades.unshift({ label: 'Tous les grades', value: null });    
    }
    
    getGrade(grade: string): TagSeverity {
        switch (grade) {
            case 'JUNIOR': return 'info';
            case 'SENIOR': return 'success';
            case 'MANAGER': return 'danger';
            default: return 'secondary'; 
        }
    }
}