import { Component } from '@angular/core';
import { Platform ,Events} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular'
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  selectedItem='';
  public appPages = [
    {
      title: 'Products',
      url: '/products',
      icon: 'assets/images/Products.png'
    },
    {
      title: 'Delivery',
      url: '/delivery',
      icon: 'assets/images/Delivery.png'
    },
    {
      title: 'Cart List',
      url: '/cartlist',
      icon: 'assets/images/cart.png'
    },
   
    // {
    //   title: 'Payment',
    //   url: '/payment',
    //   icon: 'assets/images/Payment.png'
    // },
    {
      title: 'Status',
      url: '/status',
      icon: 'assets/images/Order.png'
    },
    {
      title: 'Receipts',
      url: '/history',
      icon: 'assets/images/Receipt.png'
    },
    // {
    //   title: 'Terms & Conditions',
    //   url: '/terms',
    //   icon: 'assets/images/Terms&Conditions.png'
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuController,
    public router:Router,
    public events :Events,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openterms(){
    window.open('https://www.hortosabor.com.ar/terminos', '_system');  
  }
  gotoPage(url: any) {
    this.selectedItem = url;
    if(url =='/status'){
    this.events.publish('status:created', Date.now());
    }
    this.router.navigateByUrl(url);
  }
  closemenu() {
    this.menu.close();
  }
}
