import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

interface Evaluation {
  employee: string;
  employeePhoto: string;
  reviewer: string;
  reviewerPhoto: string;
  lastEvaluationNote: number;
  status: string;
}
@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    RatingModule,
    TagModule,
    TooltipModule,
    FormsModule],
    template: `<div class="card mb-8!">
        <div class="font-semibold text-xl mb-4">Évaluations Récemment Assignées</div>
        <p-table [value]="evaluations" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Employé</th>
          <th>Évaluateur</th>
          <th>Note dernière évaluation</th>
          <th>Statut</th>
          <th class="text-center">Actions</th>
                </tr>
            </ng-template>
            <ng-template #body let-eval>
                <tr>
                    <!-- Employé -->
          <td>
            <div class="flex items-center gap-2">
              <p-avatar [image]="eval.employeePhoto" shape="circle"></p-avatar>
              <span>{{ eval.employee }}</span>
            </div>
          </td>

          <!-- Évaluateur -->
          <td>
            <div class="flex items-center gap-2">
              <p-avatar [image]="eval.reviewerPhoto" shape="circle"></p-avatar>
              <span>{{ eval.reviewer }}</span>
            </div>
          </td>

          <!-- Note -->
          <td>
  <p-rating [(ngModel)]="eval.lastEvaluationNote" [readonly]="true"></p-rating>
          </td>

          <!-- Statut -->
          <td>
            <p-tag [value]="eval.status" [severity]="getStatusSeverity(eval.status)"></p-tag>
          </td>

                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
})
export class RecentSalesWidget {

    ngOnInit() {
        
    }

    evaluations: Evaluation[] = [
    {
      employee: 'Alain Dupont',
      employeePhoto: 'assets/images/default-profile5.png',
      reviewer: 'Bob Martin',
      reviewerPhoto: 'assets/images/default-profile1.png',
      lastEvaluationNote: 3,
      status: 'En Cours'
    },
    {
      employee: 'Marie Lefevre',
      employeePhoto: 'assets/images/default-profile3.png',
      reviewer: 'Charles Dubois',
      reviewerPhoto: 'assets/images/default-profile6.png',
      lastEvaluationNote: 3,
      status: 'En Retard'
    },
    {
      employee: 'Sophie Durand',
      employeePhoto: 'https://i.pravatar.cc/300?img=5',
      reviewer: 'Alice Dupont',
      reviewerPhoto: 'https://i.pravatar.cc/300?img=6',
      lastEvaluationNote: 5,
      status: 'Finalisée'
    },
    {
      employee: 'Luc Petit',
      employeePhoto: 'https://i.pravatar.cc/300?img=7',
      reviewer: 'Bob Martin',
      reviewerPhoto: 'https://i.pravatar.cc/300?img=2',
      lastEvaluationNote: 2,
      status: 'À Compléter'
    }
  ];

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'Finalisée': return 'success';
      case 'En Cours': return 'info';
      case 'À Compléter': return 'warn';
      case 'En Retard': return 'danger';
      default: return 'info';
    }
  }
}
