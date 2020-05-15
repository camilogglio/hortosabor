import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, ModalController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../api.service';
import { CartService } from '../cart.service';
import { Router, RouterEvent, NavigationEnd, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ProductdetailsPage } from '../productdetails/productdetails.page';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild('productSlide', { static: false }) productSlide: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    // slidesPerView: 1.5,
    autoplay: false,
    pager: true
  };
  spinnerStatus:boolean = false;
  cartData: any = [];
  navData: any = {};
  quantity: any = 1;
  selectedProduct: any = {};
  products: any = [];
  searchResult: any = [];
  product_search: any = '';
  total: any = 0;
  constructor(
    public navCtrl: NavController,
    public router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public cart: CartService,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public events: Events
  ) {
    this.total = this.cart.calculateTotal();
    console.log(this.cart.calculateTotal());
    this.getProducts();
    this.route.queryParams.subscribe(params => {
      if (params && params.delivery) {
        this.navData = JSON.parse(params.delivery);
        console.log('Nav Data', this.navData);
        this.total = this.cart.calculateTotal();
        this.getProducts();
      }
    });
  }
  ionViewDidEnter(){
    this.productSlide.slideTo(0);
    this.total = this.cart.calculateTotal();
  }
  addQuantity() {
    this.quantity = this.quantity + 1;
     this.selectedProduct.quantity = this.quantity;
     var message = this.translate.defaultLang == 'es' ? 'Haga clic en el botón del carrito para agregar producto.' : 'Click on cart button to add product.' ;
console.log(this.translate);
     this.api.presentToast(message);
  }
  removeQuantity() {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
      this.selectedProduct.quantity = this.quantity;
      var message = this.translate.defaultLang == 'es' ? 'Haga clic en el botón del carrito para agregar producto.' : 'Click on cart button to add product.' ;

     this.api.presentToast(message);
    }
  }
  async presentModal(data) {
    console.log(data);
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
       component: ProductdetailsPage,
       cssClass: 'calender-section',
       componentProps: {
        data :data
       }
    });

    // modal.onDidDismiss().then((data) => {
    
    // });

    await modal.present();
  }
  ngOnInit() {
    this.total = this.cart.calculateTotal();
  }

  slidePrev(evt) {
    this.quantity = 1;
    console.log('EddVT:- ', evt, this.productSlide);
    this.productSlide.slidePrev();
    this.productSlide.getActiveIndex().then((index) => {
      console.log(index, "index")
      this.selectedProduct = this.products[index];
     });
  }
  onCancel(evt){
    this.searchResult = [];
  }
  getIndex() {
    this.quantity = 1;
    this.productSlide.getActiveIndex().then((index) => {
      console.log(index, "index")
      this.selectedProduct = this.products[index];

      this.selectedProduct.quantity = this.quantity;
      console.log("selected", this.selectedProduct)
    });
  }
  slideNext(evt) {
    this.quantity = 1;
    console.log('EVT:- ', evt, this.productSlide);
    this.productSlide.slideNext();
    // console.log(this.productSlide.getActiveIndex());
    this.productSlide.getActiveIndex().then((index) => {
      console.log(index, "index")
      this.selectedProduct = this.products[index];

      this.selectedProduct.quantity = this.quantity;
      console.log("selected", this.selectedProduct)
    });
  }
  // this.slide.ionSlideNextStart;
  searchProduct(value) {
    console.log(value);
    const url = '/search';
    const params = {
      key: value
    };
    this.api.post(url, params).subscribe(data => {
      console.log('res:- ', data);
      if (data.search.length > 0) {
        this.searchResult = data.search;
      } else {
        this.searchResult = [];
      }
    }, err => {
      console.log('err:- ', err);
    });
  }
  chooseItem(productData) {
    console.log(productData, "hhh")
    console.log(this.products, "uu")
    this.products.forEach((element, key) => {
      if (productData.id == element.id) {
        console.log("match")
        this.selectedProduct = this.products[key];
        this.productSlide.slideTo(key);
        this.product_search = '';
      }

    });
    this.searchResult = [];
  }
  goTo(url) {
    this.router.navigateByUrl(url, { queryParams: { value: JSON.stringify(this.navData) } });
  
    // this.navCtrl.navigateForward(url);
  }
  getProducts() {
    console.log("dfsdsdf");
    this.spinnerStatus = false;
    // this.api.showLoader();
    const url = '/products';
    const params = {}
    this.api.get(url, params).subscribe(data => {
      console.log('products res:- ', data);
      setTimeout(()=>{
        // this.api.hideLoader();
      },100)   
      this.spinnerStatus = true;
      if (data.products) {
        this.products = data.products;
        this.selectedProduct = this.products[0];

        this.selectedProduct.quantity = this.quantity;
      }
      console.log(this.selectedProduct, "selected");
    }, err => {
      setTimeout(()=>{
        // this.api.hideLoader();
      },100)
      console.log('products err:- ', err);
    });
  }

  addCart() {
    this.total = 0;
    this.cartData = [];
    if (JSON.parse(localStorage.getItem("cart_data")) == null || JSON.parse(localStorage.getItem("cart_data")) == undefined) {
      this.cartData = [];
    } else {
      this.cartData = JSON.parse(localStorage.getItem("cart_data"));
    }
    console.log(this.cartData)
    var len = this.cartData.length;
    var doPush = 0;
    for (var i = 0; i < len; i++) {
      if (this.cartData[i].id && this.cartData[i].id == this.selectedProduct.id) {
        this.cartData[i].quantity = this.cartData[i].quantity + this.selectedProduct.quantity
        // this.cartData.splice(i, 1);
        doPush = 1;
      }
    }
    if (doPush === 0) {
      this.cartData.push(this.selectedProduct);
    }
    localStorage.setItem("cart_data",JSON.stringify(this.cartData));
    this.total = this.cart.calculateTotal();
    var message = this.translate.defaultLang == 'es' ? 'Producto agregado al carrito con éxito.' : 'Product added to cart successfully.' ;
    this.api.presentToast(message);
    this.events.publish('updateCart', Date.now());

  }
}
