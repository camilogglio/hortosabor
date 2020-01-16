import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { computeStackId } from '@ionic/angular/dist/directives/navigation/stack-utils';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartData: any = [];
  navData: any = {};
  quantity: any = 1;
  selectedProduct: any = {};
  products: any = [];
  searchResult: any = [];
  product_search: any = '';
  total: any = 0;
  constructor(public api:ApiService) { }
  // addCart() {
  //   this.total = 0;
  //   this.cartData = [];
  //   if (JSON.parse(localStorage.getItem("cart_data")) == null || JSON.parse(localStorage.getItem("cart_data")) == undefined) {
  //     this.cartData = [];
  //   } else {
  //     this.cartData = JSON.parse(localStorage.getItem("cart_data"));
  //   }
  //   console.log(this.cartData)
  //   var len = this.cartData.length;
  //   var doPush = 0;
  //   for (var i = 0; i < len; i++) {
  //     if (this.cartData[i].id && this.cartData[i].id == this.selectedProduct.id) {
  //       this.cartData[i].quantity = this.cartData[i].quantity + this.selectedProduct.quantity
  //       // this.cartData.splice(i, 1);
  //       doPush = 1;
  //     }
  //   }
  //   if (doPush === 0) {
  //     this.cartData.push(this.selectedProduct);
  //   }
  //   localStorage.setItem(
  //     "cart_data",
  //     JSON.stringify(this.cartData)
  //   );
  //   this.calculateTotal();
  //   this.api.presentToast('Product added to cart successfully.');
  // }
  calculateTotal() {
    this.total = 0;
    this.cartData = [];
    console.log(JSON.parse(localStorage.getItem("cart_data")));
    if(JSON.parse(localStorage.getItem("cart_data")) ==null){
      this.cartData = [];
    }else{
      this.cartData = JSON.parse(localStorage.getItem("cart_data"));
    } 
    var len = this.cartData.length;
    console.log(this.cartData)
    for (var i = 0; i < len; i++) {
      console.log(this.cartData[i].total);
      this.total += parseInt(this.cartData[i].price) * this.cartData[i].quantity;
      console.log(this.total, "total");
   
    }
    return this.total;
  }
  addQuantity(quantity) {
    this.quantity = quantity + 1;
    return this.quantity;
  }
  removeQuantity(quantity) {
    if (quantity > 1) {
      this.quantity = quantity - 1;
      return this.quantity;
    }
  }
  updateTotal(data) {
    this.total = 0;
      this.total += parseInt(data.price) * data.quantity;
      data.subtotal = this.total;
      console.log(this.total, "total");
      return data;
 }

}
