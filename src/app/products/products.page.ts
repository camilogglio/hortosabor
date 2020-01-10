import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../api.service';
import { Router, RouterEvent, NavigationEnd, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild('productSlide', { static: false }) productSlide: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1.5,
    autoplay:false,
    pager: true
  };
  navData: any = {};
  products: any = [];
  constructor(
    public navCtrl: NavController,
    public router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params && params.delivery) {
        this.navData = JSON.parse(params.delivery);
        console.log('Nav Data', this.navData);
        this.getProducts();
      }
    });
  }

  ngOnInit() {
  }

  slidePrev() {
    this.productSlide.slidePrev();
  }

  slideNext() {
    this.productSlide.slideNext();
  }

  getProducts() { 
    const url = '/products';
    const params = {}
    this.api.get(url, params).subscribe(data => {
      console.log('products res:- ', data);
      if(data.products) {
        this.products = data.products;
      }
    }, err => {
      console.log('products err:- ', err);
    });
  }

}
