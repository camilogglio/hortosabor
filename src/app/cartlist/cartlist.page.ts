import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ApiService } from '../api.service';
import { IonSlides, NavController, NavParams, Events } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.page.html',
  styleUrls: ['./cartlist.page.scss'],
})
export class CartlistPage implements OnInit {
  cartList: any = [];
  total: any = 0;
  index: any = '';
  selectedData: any = {};
  navData: any = '';
  constructor(public translate: TranslateService, public events: Events, public cart: CartService, public api: ApiService, public navCtrl: NavController, public route: ActivatedRoute, public router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.value) {
        this.navData = JSON.parse(params.value);
        console.log("card data **********" + JSON.stringify(this.navData));
      }
    });

    this.total = this.cart.calculateTotal();
    console.log(JSON.parse(localStorage.getItem('cart_data')))
    if (JSON.parse(localStorage.getItem('cart_data'))) {
      if (JSON.parse(localStorage.getItem('cart_data')).length > 0) {
        this.cartList = JSON.parse(localStorage.getItem('cart_data'));
        this.cartList.forEach(element => {
          element.subtotal = parseInt(element.price) * element.quantity;
          element.selectedstatus = false;
        });
      }
    }

    console.log('CONSTRUCTOR');
    this.events.subscribe('updateCart', (time) => {
      console.log('Constructor event updateCart');
      this.total = this.cart.calculateTotal();
      console.log(JSON.parse(localStorage.getItem('cart_data')))
      if (JSON.parse(localStorage.getItem('cart_data'))) {
        if (JSON.parse(localStorage.getItem('cart_data')).length > 0) {
          this.cartList = JSON.parse(localStorage.getItem('cart_data'));
          this.cartList.forEach(element => {
            element.subtotal = parseInt(element.price) * element.quantity;
            element.selectedstatus = false;
          });
        }
      }
    });

    console.log(this.cartList, 'CARTLIST');

  }

  ngOnInit() {
    console.log('ngOnInit');

    this.events.subscribe('updateCart', (time) => {
      console.log('ngOnInit event updateCart');
      this.total = this.cart.calculateTotal();
      console.log(JSON.parse(localStorage.getItem('cart_data')))
      if (JSON.parse(localStorage.getItem('cart_data'))) {
        if (JSON.parse(localStorage.getItem('cart_data')).length > 0) {
          this.cartList = JSON.parse(localStorage.getItem('cart_data'));
          this.cartList.forEach(element => {
            element.subtotal = parseInt(element.price) * element.quantity;
            element.selectedstatus = false;
          });
        }
      }
    });

    console.log(this.cartList, 'CARTLIST');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');

    this.total = this.cart.calculateTotal();
    console.log(JSON.parse(localStorage.getItem('cart_data')))
    if (JSON.parse(localStorage.getItem('cart_data'))) {
      if (JSON.parse(localStorage.getItem('cart_data')).length > 0) {
        this.cartList = JSON.parse(localStorage.getItem('cart_data'));
        this.cartList.forEach(element => {
          element.subtotal = parseInt(element.price) * element.quantity;
          element.selectedstatus = false;
        });
      }
    }
  }

  goTo() {
    this.router.navigate(['/payment'], { queryParams: { value: JSON.stringify(this.navData) } });
    // this.navCtrl.navigateForward('/payment');
  }
  SelectedProduct(pro, index) {
    this.index = index;
    this.selectedData = pro;
    this.cartList.forEach(element => {
      if (element.id == this.selectedData.id) {
        this.selectedData.selectedstatus = true;
      } else {
        element.selectedstatus = false;
      }
    });
    console.log(this.selectedData);
  }
  add_quantity() {
    console.log(this.selectedData, "selected Product", Object.keys(this.selectedData).length);
    if (Object.keys(this.selectedData).length) {
      this.selectedData.quantity = this.cart.addQuantity(this.selectedData.quantity);
      console.log(this.selectedData.quantity, "Qunatiyt", "++++++++++", this.cartList, "cartDAta");
      this.selectedData.subtotal = this.cart.updateTotal(this.selectedData).subtotal;
      localStorage.setItem("cart_data", JSON.stringify(this.cartList));
      this.total = this.cart.calculateTotal();
    } else {
      // this.api.presentToast('Please first select a product to increase the quantity');
      var message = this.translate.defaultLang == 'es' ? 'Primero seleccione un producto para aumentar la cantidad' : 'Please first select a product to increase the quantity';
      this.api.presentToast(message);
    }
  }
  remove_quantity() {
    console.log(this.selectedData, "selected Product");
    if (Object.keys(this.selectedData).length) {
      if (this.selectedData.quantity > 1) {
        this.selectedData.quantity = this.cart.removeQuantity(this.selectedData.quantity);
        console.log(this.selectedData.quantity, "Qunatiyt", "++++++++++", this.cartList, "cartDAta");
        this.selectedData.subtotal = this.cart.updateTotal(this.selectedData).subtotal;
        localStorage.setItem("cart_data", JSON.stringify(this.cartList));
        this.total = this.cart.calculateTotal();
      }

    } else {
      // this.api.presentToast('Please first select a product to decrease the quantity');
      var message = this.translate.defaultLang == 'es' ? 'Primero seleccione un producto para disminuir la cantidad' : 'Please first select a product to decrease the quantity';
      this.api.presentToast(message);

    }
  }
  remove() {
    console.log(this.index);
    if (Object.keys(this.selectedData).length) {
      this.cartList.splice(this.index, 1);
      // var that = this;
      // this.cartList.forEach((element, key) => {
      //   console.log(key, 'index')
      //   console.log(element.id +'=='+ this.selectedData.id)
      //   if (element.id == this.selectedData.id) {          
      //     console.log("if", key)
      //     that.cartList.splice(1, key);
      //   } 
      // });
      console.log(this.cartList);
      localStorage.setItem("cart_data", JSON.stringify(this.cartList));
      this.total = this.cart.calculateTotal();
      this.selectedData = {};
      // this.cartList = JSON.parse(localStorage.getItem('cart_data'));
    } else {
      // this.api.presentToast('Please first select a product to remove from cart');
      var message = this.translate.defaultLang == 'es' ? 'Primero seleccione un producto para disminuir la cantidad' : 'Please first select a product to remove from cart';
      this.api.presentToast(message);
    }
  }
}
