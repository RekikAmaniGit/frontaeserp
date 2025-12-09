import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Test } from "./components/test/test";
import { UserList } from "./components/user-list/user-list";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ActiaERP');


}
