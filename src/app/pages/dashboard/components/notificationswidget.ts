import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notifications</div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>

        <span class="block text-muted-color font-medium mb-4">TODAY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-check-circle text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Med ben Ali
                    <span class="text-surface-700 dark:text-surface-100"> a terminé son évaluation de performance (Score : <span class="text-primary font-bold">85/100</span>)</span>
                </span>
            </li>
            <li class="flex items-center py-2">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-briefcase text-orange-500"></i>
                </div>
                <span class="text-surface-700 dark:text-surface-100 leading-normal">Nouvelle candidature urgente : Développeur Senior (Salaire demandé : <span class="text-primary font-bold">$2500.00</span>)</span>
            </li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-calendar text-pink-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"
                    >Rappel : L'entretien annuel de Ahlem Rekik
                    <span class="text-surface-700 dark:text-surface-100"> est dû la semaine prochaine.</span>
                </span>
            </li>
        </ul>
        <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                     <i class="pi pi-user-minus text-green-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">L'utilisateur Ali ben brahmi a été désactivé (<span class="text-primary font-bold">Fin de Contrat</span>).</span>
            </li>
            <li class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-users text-purple-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal"><span class="text-primary font-bold">12</span> personnes ont rejoins la famille ACTIA.</span>
            </li>
        </ul>
    </div>`
})
export class NotificationsWidget {
    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Marquer tout comme lu', icon: 'pi pi-fw pi-check' },
        { label: 'Supprimer tout', icon: 'pi pi-fw pi-trash' }
    ];
}
