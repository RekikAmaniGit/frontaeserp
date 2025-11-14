import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from "primeng/badge";
import { OverlayBadgeModule } from "primeng/overlaybadge";

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, BadgeModule, OverlayBadgeModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
               <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>Integrated Data Flow and Management</title>
    
    <defs>
        <style>
            /* Couleur Primaire (Similaire au vert Sakai) */
            .primary-color { fill: #32B55B; }
            /* Couleur Secondaire (Pour les éléments de structure/base) */
            .secondary-color { fill: #495057; } 
        </style>
    </defs>

    <rect x="10" y="35" width="30" height="5" rx="1" ry="1" class="secondary-color"/>
    
    <rect x="15" y="20" width="20" height="10" rx="1" ry="1" class="primary-color"/>

    <path 
        d="M 5 25 L 15 25 M 15 25 L 12 22 M 15 25 L 12 28" 
        stroke="#495057" 
        stroke-width="2" 
        stroke-linecap="round" 
        fill="none"
    />

    <path 
        d="M 45 25 L 35 25 M 35 25 L 38 22 M 35 25 L 38 28" 
        stroke="#32B55B" 
        stroke-width="2" 
        stroke-linecap="round" 
        fill="none"
    />

    <path 
        d="M 25 30 L 25 35" 
        stroke="#495057" 
        stroke-width="2" 
        stroke-linecap="round" 
        fill="none"
    />

    <circle cx="25" cy="15" r="3" class="secondary-color"/>
    <circle cx="20" cy="12" r="3" class="secondary-color"/>
    <circle cx="30" cy="12" r="3" class="secondary-color"/>
    
    <path 
        d="M 25 20 L 25 18" 
        stroke="#495057" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        fill="none"
    />
</svg>
                <span>AESERP</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                   
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                     <button type="button" class="layout-topbar-action" [routerLink]="['/notification']">

<p-overlaybadge value="2" severity="danger" size="small">
    <i class="pi pi-bell" style="font-size: 1rem"></i>
</p-overlaybadge>

  </button> 
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> 
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
