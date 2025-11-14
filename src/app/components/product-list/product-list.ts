import { Component, signal, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product';
import { CurrencyPipe } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table'; 
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-product-list',
  imports: [TableModule, CurrencyPipe, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {

  products = new BehaviorSubject<Product[] | null>(null);
  
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.listProducts();
  }

  listProducts() {
    this.productService.getProductList().subscribe({
      next: (data: any) => {
        console.log(data);
        this.products.next(data);

      },
      error: (err) => {
        console.error('Erreur récupération produits', err);
      }
    });
  }

}
