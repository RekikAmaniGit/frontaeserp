import { Component } from '@angular/core';
import { Person } from '../../person';
import { NgFor, NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [NgFor, CurrencyPipe],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  tabs: Person[] = [new Person('amani', 30), new Person('john', 25)];
}
