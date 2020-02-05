import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ApiService } from '../api.service';
import { Platform, Events, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
declare var $: any;
declare var Mercadopago: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  cardForm: FormGroup;
  paymentForm: FormGroup;
  activeImage: boolean = false;
  active_Image: boolean = false;
  card_Image: boolean = false;
  cartList: any = [];
  total: any = 0;
  index: any = '';
  selectedData: any = {};
  navData: any = '';
  comments: any = '';
  submitAttempt: boolean = false;
  minDate = new Date().getFullYear();
  date = (new Date().getFullYear() + 5) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  maxDate: any = '';
  terms: any = false;
  doSubmit = false;
  token: any = '';
  products: any = [];
  constructor(public translate: TranslateService, public events: Events, public cart: CartService, public api: ApiService, public navCtrl: NavController, public formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router) {
    this.activeImage = true;
    console.log(this.date);
    Mercadopago.setPublishableKey("TEST-aece564d-442e-4a41-80b9-a07f31624d11");
    this.maxDate = moment(moment(this.date, 'YYYY-MM-DD')).format('YYYY-MM-DD');
    this.total = this.cart.calculateTotal();
    this.cardForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      delivery_address: [''],
      delivery_date: [''],
      dailcode: [''],
      local_id: ["", Validators.compose([Validators.required])]
    });

    this.paymentForm = this.formBuilder.group({
      cardnumber: ["", Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      expMonth: ["", Validators.compose([Validators.required])],
      expYear: ["", Validators.compose([Validators.required])],
      cvv: ["", Validators.compose([Validators.required])],
      cardname: ["", Validators.compose([Validators.required])],
      expDate: ["", Validators.compose([Validators.required])],
      // email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    });
    this.total = this.cart.calculateTotal();
    if (JSON.parse(localStorage.getItem('cart_data'))) {
      if (JSON.parse(localStorage.getItem('cart_data')).length > 0) {
        this.cartList = JSON.parse(localStorage.getItem('cart_data'));
        this.cartList.forEach(element => {
          this.products.push({
            product_id: element.id,
            qty: element.quantity,
            price: element.price
          })
        });
        console.log(this.products);
      }
      // console.log(localStorage.getItem('comment'));
      if (localStorage.getItem('comment') != 'undefined') {
        this.comments = JSON.parse(localStorage.getItem('comment'));
      } else {
        this.comments = '';
      }
    }
    // this.route.queryParams.subscribe(params => {
    //   if (params && params.value) {
    //     this.navData = JSON.parse(params.value);
    //     console.log(this.navData);
    //     this.cardForm.controls.delivery_address.setValue(this.navData.place)
    //     this.cardForm.controls.delivery_date.setValue(this.navData.deliveryDate)
    //   }
    // });
    if (JSON.parse(localStorage.getItem('deliveryData'))) {
      this.cardForm.controls.delivery_address.setValue(JSON.parse(localStorage.getItem('deliveryData')).place)
      this.cardForm.controls.delivery_date.setValue(JSON.parse(localStorage.getItem('deliveryData')).deliveryDate)
    }
  }

  ngOnInit() {
    $(".accordion__answer:first").show();
    $(".accordion__question:first").addClass("expanded");
    // var phone = document.getElementById("mobileno");
    setTimeout(() => {
      $("#mobileno").intlTelInput({
        hiddenInput: "phone-no",
        initialCountry: "gb",
        utilsScript: "assets/js/utils.js"
      });
      // $("#mobileno").usPhoneFormat();
    }, 100);

    // document.getElementById("role-button1").classList.add("btn-activated");
  }
  check() {
    console.log(this.paymentForm.value.expDate);
    var date = this.paymentForm.value.expDate;
    var i = date.indexOf("-");
    var year = date.slice(0, i).trim();
    var month: any = new Date(this.paymentForm.value.expDate).getMonth() + 1;
    var newmonth = moment(this.paymentForm.value.expDate).format('MM');
    this.paymentForm.controls.expMonth.setValue(month)
    this.paymentForm.controls.expYear.setValue(year)
    console.log("month", month, newmonth[0]);
    console.log("year", year);
  }
  chooseType(value) {
    if (value == 'credit') {
      this.active_Image = false;
      this.card_Image = false;
      this.activeImage = true;
    }
    if (value == 'debit') {
      this.card_Image = false;
      this.activeImage = false;
      this.active_Image = true;
    }
    if (value == 'cash') {
      this.card_Image = true;
      this.activeImage = false;
      this.active_Image = false;
    }
  }
  validatecvv(cvv) {
    console.log('CVV Value:- ', cvv.value);
    if ($(cvv).val().length >= 4) {
      $(cvv).val($(cvv).val().substr(0, 4));
    }
    // cvv.value = '';
  }
  pay() {

    if (this.paymentForm.value.cardnumber == '') {
      this.api.presentToast('Enter card number.')
    } else if (this.paymentForm.value.cvv == '') {
      this.api.presentToast('Enter expiration CVV.')
    } else if (this.paymentForm.value.expMonth == '') {
      this.api.presentToast('Enter expiration month.')
    } else if (this.paymentForm.value.expYear == '') {
      this.api.presentToast('Enter expiration year.')
    } else if (this.paymentForm.value.cardname == '') {
      this.api.presentToast('Enter expiration card holder name.')
    } else {
      var that = this;
      this.addEvent(document.querySelector('#pay'), 'submit', this.doPay());

    }
  }
  addEvent(el, eventName, handler) {
    console.log('el', el);
    if (el) {
      if (el.addEventListener) {
        console.log("if");
        el.addEventListener(eventName, handler);
      } else {
        console.log("else");
        el.attachEvent('on' + eventName, function () {
          handler.call(el);
        });
      }
    }
  };
  doPay() {
    var phone = document.getElementById("mobileno");
    var country = $(phone).intlTelInput("getSelectedCountryData").dialCode;
    if (this.cardForm.value.phone) {
      console.log("+" + country);
      var dialcode = "+" + country;
    }
    var full_number = dialcode + this.cardForm.value.phone;
    console.log(full_number);
    this.api.showLoader();
    event.preventDefault();
    var that = this;
    console.log('event', that.navData);
    // event.preventDefault();
    if (!this.doSubmit) {
      const url = '/orders';
      let params: any = {
        product: this.products,
        delivery_address: that.cardForm.value.delivery_address,
        delivery_date: that.cardForm.value.delivery_date,
        phone_number: full_number,
        email: that.cardForm.value.email,
        local_id: that.cardForm.value.local_id,
        total_price: that.total,
        payment_type: 'card',
        name: this.cardForm.value.name,
        comment: this.comments,
      };
      Mercadopago.clearSession();
      var $form = document.querySelector('#pay');
      console.log($form, params)
      // Mercadopago.createToken($form, this.sdkResponseHandler); // The function "sdkResponseHandler" is defined below
      Mercadopago.createToken($form, (res, data) => {
        setTimeout(() => {
          this.api.hideLoader();
        }, 1000)
        that.token = data.id;
        console.log('token', that.navData, data);
        if (data.cause) {
          if (data.cause[0].code == "E301") {

            // this.api.presentToast('Invalid Card Number')
            var message = this.translate.defaultLang == 'es' ? 'Numero de tarjeta invalido' : 'Invalid Card Number';
            this.api.presentToast(message);
          }
          if (data.cause[0].code == "E302") {
            // this.api.presentToast('Invalid CVV Number')
            var message = this.translate.defaultLang == 'es' ? 'Número de CVV no válido.' : 'Invalid CVV Number.';
            this.api.presentToast(message);
          }
        } else {
          params.token = that.token;
          console.log(params, "parmas");
          this.api.post(url, params).subscribe(data => {

            console.log('res:- ', data);
            if (data.error) {
              this.api.presentToast(data.error.message);
            } else {
              var message = this.translate.defaultLang == 'es' ? 'Pedido Enviado Correctamente.' : 'Order Submitted Successfully.';
              this.api.presentToast(message);
              this.cardForm.reset();
              this.paymentForm.reset();
              // localStorage.removeItem('deliveryData');
              localStorage.removeItem('cart_data');

              // this.events.publish('delivery:created', Date.now());
              this.router.navigate(['/status'], { queryParams: { value: JSON.stringify(data.verify_number) } });
            }



          }, err => {
            console.log('err:- ', err);
          });
        }



      }, err => {
        console.log('err:- ', err);
      });
    }
  };
  updatephone(evn) {
    console.log(evn.target.value);
    var s = evn.target.value;
    var t = s.replace(/^0+/, '');
    console.log(t);
    this.cardForm.controls.phone.setValue(t)
  }

  validateCard(card) {
    console.log(card)
    if (card.value.length > 0) {
      // this.formatCardNumber(card.value);
      $('input[formControlName="cardnumber"]').validateCreditCard(result => {
        if (result.card_type) {
          $('input[formControlName="cardnumber"]')
            // .parent()
            .addClass(result.card_type.name);
        }
        if (result.valid) {
          $('input[formControlName="cardnumber"]')
            // .parent()
            .addClass("valid");
        } else {
          $('input[formControlName="cardnumber"]')
            // .parent()
            .removeClass("valid");
        }
      });
    } else {
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("visa");
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("mastercard");
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("visa_electron");
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("maestro");
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("discover");
      $('input[formControlName="cardnumber"]')
        // .parent()
        .removeClass("valid");
    }
  }

  formatCardNumber(value) {
    var formatVal: any;
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []

    for (var i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      formatVal = parts.join(' ');
    } else {
      formatVal = value;
    }
    console.log('formatVal:- ', parts, formatVal);
    $('input[formControlName="cardnumber"]').val(formatVal);
  }
  confirm_payment() {
    var phone = document.getElementById("mobileno");
    var country = $(phone).intlTelInput("getSelectedCountryData").dialCode;
    if (this.cardForm.value.phone) {
      console.log("+" + country);
      var dialcode = "+" + country;
    }
    var full_number = dialcode + this.cardForm.value.phone;
    console.log(full_number);
    const url = '/orders';
    const params = {
      product: this.products,
      delivery_address: this.cardForm.value.delivery_address,
      delivery_date: this.cardForm.value.delivery_date,
      phone_number: full_number,
      email: this.cardForm.value.email,
      local_id: this.cardForm.value.local_id,
      total_price: this.total,
      token: '',
      payment_type: 'cash',
      name: this.cardForm.value.name,
      comment: this.comments,
    };
    console.log(params, "parmas");
    this.api.post(url, params).subscribe(data => {
      console.log('res:- ', data);
      var message = this.translate.defaultLang == 'es' ? 'Pedido Enviado Correctamente.' : 'Order Submitted Successfully.';
      this.api.presentToast(message);
      // this.api.presentToast(data.success);
      this.cardForm.reset();
      this.paymentForm.reset();
      localStorage.removeItem('cart_data');
      // localStorage.removeItem('deliveryData');
      // localStorage.removeItem('comment');
      // this.events.publish('delivery:created', Date.now());
      this.navCtrl.navigateRoot(['/status'], { queryParams: { value: JSON.stringify(data.verify_number) } });
      // if (data.search.length > 0) {
      //   this.searchResult = data.search;
      // } else {
      //   this.searchResult = [];
      // }
    }, err => {
      console.log('err:- ', err);
    });
  }

}
