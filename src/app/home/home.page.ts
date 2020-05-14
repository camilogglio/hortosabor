import { Component } from '@angular/core';
import { NavController,MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
declare var Mercadopago: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  terms: any = false;
  doSubmit = false;
  constructor(
    public navCtrl: NavController,
    public api: ApiService,
    public storage: Storage,
    public menu:MenuController,
    public translate: TranslateService
  ) {
    // translate.setDefaultLang('es');
    this.menu.swipeEnable(false);
    // console.log(Mercadopago);
    //Mercadopago.setPublishableKey("TEST-aece564d-442e-4a41-80b9-a07f31624d11");
    Mercadopago.setPublishableKey("APP_USR-6f9e609a-d6be-4d61-b84f-cacd8bd99a19");
    // Mercadopago.createToken(form, (tokenHandler) => {
    //   console.log('tokenHandler', tokenHandler);
    // });
    // Mercadopago.getIdentificationTypes();
    // this.addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', this.guessingPaymentMethod);
    // this.addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', this.guessingPaymentMethod);
    this.storage.get('terms').then(val => {
      if (val) {
        this.terms = val;
        setTimeout(() => {
          if (this.terms) {
            this.storage.set('terms', this.terms);
            this.navCtrl.navigateRoot('/delivery');
          } else {
            // this.api.presentToast('Please accept terms & conditions.');
          }
        }, 3000);
      } else {

      }
    });
  }

  pay() {
    this.addEvent(document.querySelector('#pay'), 'submit', this.doPay);
  }

  enter() {
    if (this.terms) {
      this.storage.set('terms', this.terms);
      this.navCtrl.navigateRoot('/delivery');
    } else {
      var message = this.translate.defaultLang == 'es' ? 'Por favor acepte los términos y condiciones.' : 'Please accept terms & conditions.';
        this.api.presentToast(message);
      // this.api.presentToast('Please accept terms & conditions.');
    }
  }

  agreeTerms() {
    console.log('Terms', this.terms);
    window.open('https://www.hortosabor.com.ar/terminos', '_system');  
  }


  getBin() {
    var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
    return ccNumber['value'].replace(/[ .-]/g, '').slice(0, 6);
  };

  doPay(event){
    // event.preventDefault();
    if(!this.doSubmit){
      console.log('event', event);
      var $form = document.querySelector('#pay');
      console.log( $form )
      // Mercadopago.createToken($form, this.sdkResponseHandler); // The function "sdkResponseHandler" is defined below
      Mercadopago.createToken($form, (res) => {
        console.log('token', res);
      }); // The function "sdkResponseHandler" is defined below
      return false;
    }
};


  guessingPaymentMethod(event) {
    var bin = this.getBin();
    if (event.type == "keyup") {
      if (bin.length >= 6) {
        Mercadopago.getPaymentMethod({
          "bin": bin
        }, this.setPaymentMethodInfo);
      }
    } else {
      setTimeout(function () {
        if (bin.length >= 6) {
          Mercadopago.getPaymentMethod({
            "bin": bin
          }, this.setPaymentMethodInfo());
        }
      }, 100);
    }
  };

  // Mercadopago.getIdentificationTypes();

  setPaymentMethodInfo(status, response) {
    if (status == 200) {
      // do somethings ex: show logo of the payment method
      var form = document.querySelector('#pay');
      if (document.querySelector("input[name=paymentMethodId]") == null) {
        var paymentMethod = document.createElement('input');
        paymentMethod.setAttribute('name', "paymentMethodId");
        paymentMethod.setAttribute('type', "hidden");
        paymentMethod.setAttribute('value', response[0].id);
        form.appendChild(paymentMethod);
      } else {
        document.querySelector("input[name=paymentMethodId]")['value'] = response[0].id;
      }
    }
  };

  addEvent(el, eventName, handler) {
    console.log('el', el);
    if(el) {
      if (el.addEventListener) {
        el.addEventListener(eventName, handler);
      } else {
        el.attachEvent('on' + eventName, function () {
          handler.call(el);
        });
      }
    }
  };

  sdkResponseHandler(status, response) {
    console.log(response);
    if (status != 200 && status != 201) {
      alert("verify filled data");
    } else {
      var form = document.querySelector('#pay');
      var card = document.createElement('input');
      card.setAttribute('name', "token");
      card.setAttribute('type', "hidden");
      card.setAttribute('value', response.id);
      form.appendChild(card);
      // doSubmit=true;
      // form.submit();
    }
  };


}
