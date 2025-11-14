import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from "primeng/tag";

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, TagModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Employés Actifs</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                         <i class="pi pi-users text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">24 nouvelles </span>
                <span class="text-muted-color"> embauches ce mois-ci</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Taux d'Attrition</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">1.1%</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-line text-orange-500 text-xl"></i>
                    </div>
                </div>
                <p-tag icon="pi pi-arrow-down"></p-tag>
                <span class="text-muted-color">depuis la semaine dernière</span>
                
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Évaluations Finalisées</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">284</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-green-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">520 </span>
                <span class="text-muted-color">en cours de révision</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Postes à Pourvoir</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Postes</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                         <i class="pi pi-briefcase text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">85 </span>
                <span class="text-muted-color">CV reçus</span>
            </div>
        </div>`
})
export class StatsWidget {}
