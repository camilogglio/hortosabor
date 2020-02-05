import { Component } from '@angular/core';
import { Platform ,Events} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular'
import { ApiService } from '../app/api.service';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  selectedItem='';
  deliveryTranslate='';
  langValue:any='en';
  public appPages = [
    // {
    //   title: 'Products',
    //   url: '/products',
    //   icon: 'assets/images/Products.png'
    // },
    {
      title:'delivery',
      url: '/delivery',
      icon: 'assets/images/Delivery.png'
    },
    {
      title: 'cart_list',
      url: '/cartlist',
      icon: 'assets/images/cart.png'
    },
   
    // {
    //   title: 'Payment',
    //   url: '/payment',
    //   icon: 'assets/images/Payment.png'
    // },
    {
      title: 'status',
      url: '/status',
      icon: 'assets/images/Order.png'
    },
    {
      title: 'receipts',
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
    public api:ApiService,
    public translate: TranslateService,
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.translate.setDefaultLang('es');
    // if(localStorage.getItem('lang') && localStorage.getItem('lang')!=undefined){
    //   var val = JSON.parse(localStorage.getItem('lang'));
    //   this.translate.setDefaultLang(val); 
    //   this.langValue = val;
    // }else{
    //   this.translate.setDefaultLang('es');
    // }
    // this.translate.get('delivery').subscribe(
    //   value => {
    //     console.log(value)
    //     this.deliveryTranslate = value;
    //   }
    // )
    // this.storage.get("lang").then(val => {
    //   console.log('Default lang', val);
    //   if (val) {
    //     this.translate.setDefaultLang(val);
    //   } else {
    //     this.translate.setDefaultLang('en');
    //   }
    // });
  }
  selectLang(){
    localStorage.setItem('lang', JSON.stringify(this.langValue));
    this.translate.setDefaultLang(this.langValue); 
  }
  open(){
    if(localStorage.getItem('deliveryData') && localStorage.getItem('deliveryData')!=undefined){
      this.router.navigateByUrl('/products');
      }else{
        var message = this.translate.defaultLang == 'es' ? 'Seleccione Lugar de entrega y fecha.' : 'Select Delivery Place and Date.' ;
        this.api.presentToast(message);
      }
   
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
