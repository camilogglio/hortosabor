import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Products',
      url: '/products',
      icon: 'assets/images/Products.png'
    },
    {
      title: 'Cart List',
      url: '/cartlist',
      icon: 'assets/images/cart.png'
    },
    {
      title: 'Delivery',
      url: '/delivery',
      icon: 'assets/images/Delivery.png'
    },
    {
      title: 'Payment',
      url: '/payment',
      icon: 'assets/images/Payment.png'
    },
    {
      title: 'Status',
      url: '/status',
      icon: 'assets/images/Order.png'
    },
    {
      title: 'Receipts',
      url: '/status',
      icon: 'assets/images/Receipt.png'
    },
    {
      title: 'Terms & Conditions',
      url: '/status',
      icon: 'assets/images/Terms&Conditions.png'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  closemenu() {
    this.menu.close();
  }
}
