import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../api.service';
import { Router, RouterEvent, NavigationEnd, NavigationExtras } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { TranslateService } from '@ngx-translate/core';
// import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;
@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})

export class DeliveryPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  places: any = [];
  selectedPlace: any = '';
  selectedPlaceDate: any = {};
  timeInterval = 0;
  intervalDate: any = [];
  selectedDate: any = '';
  comments: any = '';
  hours: any = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];
  constructor(
    public alertController: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public api: ApiService,
    public router: Router,
    public translate: TranslateService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public events: Events,
  ) {
    if (JSON.parse(localStorage.getItem('deliveryData')) && JSON.parse(localStorage.getItem('deliveryData')) != undefined) {
      this.selectedPlace = JSON.parse(localStorage.getItem('deliveryData')).place;

      // this.selectedDate = JSON.parse(localStorage.getItem('deliveryData')).deliveryDate;
      this.getDeliveryPlaces1();
      setTimeout(() => {
        var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
        console.log('result:- ', result);
        if (result.length > 0) {
          this.selectedPlaceDate = result[0];
          this.selectedDate = '';
          this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
          this.changeDeleveryTime();
        }
      }, 1000)
    }
    this.events.subscribe('delivery:created', (time) => {
      this.selectedDate = '';
      this.selectedPlace = '';
      this.comments = '';
      this.intervalDate = [];
    });
  }

  ngOnInit() {
    this.getDeliveryPlaces();
    this.loadMap();
  }
  ionViewDidEnter() {
    if (JSON.parse(localStorage.getItem('deliveryData')) && JSON.parse(localStorage.getItem('deliveryData')) != undefined) {
      this.selectedPlace = JSON.parse(localStorage.getItem('deliveryData')).place;
      // this.selectedDate = JSON.parse(localStorage.getItem('deliveryData')).deliveryDate;
      this.selectedDate = JSON.parse(localStorage.getItem('deliveryData')).deliveryDate;
      // this.getDeliveryPlaces1();
      // setTimeout(()=>{
      //   var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
      //   console.log('result:- ', result);
      //   if(result.length>0){
      //     this.selectedPlaceDate = result[0];
      //     this.selectedDate = '';
      //     this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
      //     this.changeDeleveryTime();
      //   }
      // },1000)
    }
    if (JSON.parse(localStorage.getItem('comment')) && JSON.parse(localStorage.getItem('comment')) != undefined) {
      this.comments = JSON.parse(localStorage.getItem('comment'));
    }
  }
  loadMap(lat?: any, lng?: any) {
    if (lat && lng) {
      this.initMap(lat, lng);
    } else {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.initMap(resp.coords.latitude, resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  }

  initMap(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    // this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);    // To get address from lat-long.
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var goldenGatePosition = { lat: this.map.center.lat(), lng: this.map.center.lng() };
    var marker = new google.maps.Marker({
      position: goldenGatePosition,
      map: this.map,
    });
  }

  /* getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    var goldenGatePosition = {lat: lattitude,lng: longitude};
    var marker = new google.maps.Marker({
      position: goldenGatePosition,
      map: this.map,
    });

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
            responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
        console.log('Address:- ', this.address);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  } */
  async presentAlertPrompt() {
    this.translate.get(['cancel', 'replacing-address-could-empty-cart','okay','areyousure']).subscribe(
      async (value) => {
        console.log('VALUE:: ', value);
        // value is our translated string
        // this.cancelTranslate = value;

        const alert = await this.alertController.create({
          header: value['areyousure'],
          message: value['replacing-address-could-empty-cart'],
          buttons: [
            {
              text: value['cancel'],
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                this.selectedPlace = JSON.parse(localStorage.getItem('deliveryData')).place;
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: value['okay'], 
              handler: () => {
                console.log('Confirm Okay');
                localStorage.removeItem('cart_data')
              }
            }
          ]
        });

        await alert.present();
      }
    )
  }
  getDeliveryPlaces() {
    this.api.showLoader();
    const url = '/locations';
    const params = {};
    this.api.get(url, params).subscribe(data => {
      setTimeout(() => {
        this.api.hideLoader();
      }, 1000);
      console.log('Places res:- ', data);
      if (data.locations) {
        this.places = data.locations;
      }
    }, err => {
      setTimeout(() => {
        this.api.hideLoader();
      }, 1000);
      console.log('Places err:- ', err);
    });
  }
  getDeliveryPlaces1() {
    // this.api.showLoader();
    const url = '/locations';
    const params = {};
    this.api.get(url, params).subscribe(data => {

      console.log('Places res:- ', data);
      if (data.locations) {
        this.places = data.locations;
      }
    }, err => {

      console.log('Places err:- ', err);
    });
  }
  changeDeliveryPlace(evt) {
    this.selectedPlaceDate = {};
    console.log('selected delivery:- ', this.selectedPlace, JSON.parse(localStorage.getItem('deliveryData')));
    if (JSON.parse(localStorage.getItem('deliveryData')) && JSON.parse(localStorage.getItem('deliveryData')) != undefined) {
      if (this.selectedPlace != JSON.parse(localStorage.getItem('deliveryData')).place) {
        console.log("ifffffffffffffffffff")
        var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
        console.log('result:- ', result);
        if (result.length > 0) {
          this.selectedPlaceDate = result[0];
          this.selectedDate = '';
          this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
          // this.getAddressFromCoords(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
          this.changeDeleveryTime();
        }
        if (localStorage.getItem('cart_data') && JSON.parse(localStorage.getItem('cart_data')).length > 0) {
          this.presentAlertPrompt();
        }
      } else {
        console.log("elsssssssssssss")
        var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
        console.log('result:- ', result);
        if (result.length > 0) {
          this.selectedPlaceDate = result[0];
          this.selectedDate = '';
          this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
          // this.getAddressFromCoords(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
          this.changeDeleveryTime();
        }
      }

    } else {
      var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
      console.log('result:- ', result);
      if (result.length > 0) {
        this.selectedPlaceDate = result[0];
        this.selectedDate = '';
        this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
        // this.getAddressFromCoords(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
        this.changeDeleveryTime();
      }
    }


  }

  changeDeleveryTime() {
    this.selectedPlaceDate;
    var hours = parseInt(this.selectedPlaceDate.hours);
    var days = hours / 24;
    var currentDate = new Date();
    this.timeInterval = currentDate.getDate() + days;
    this.intervalDate = [];

    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    console.log('timeInt', this.timeInterval, this.timeInterval + '-' + month + '-' + year, new Date(this.timeInterval + '-' + month + '-' + year));
    var that = this;
    this.hours.forEach(element => {
      that.intervalDate.push(this.timeInterval + '-' + ((month).toString().length > 1 ? month : '0' + month) + '-' + year + ' ' + element);
    });
    console.log(this.intervalDate, "hours");
    if (JSON.parse(localStorage.getItem('deliveryData')) && JSON.parse(localStorage.getItem('deliveryData')) != undefined) {
      this.selectedDate = JSON.parse(localStorage.getItem('deliveryData')).deliveryDate;
    }
    // this.intervalDate.push(this.timeInterval + '-' + ((month).toString().length > 1 ? month : '0'+month) + '-' + year);
    this.api.hideLoader();
    setTimeout(() => {
      this.api.hideLoader();
    }, 500);
  }

  confirm() {
    setTimeout(() => {
      if (!this.selectedPlace.length) {
        // this.api.presentToast('Please select delivery place.');
        var message = this.translate.defaultLang == 'es' ? 'Por favor seleccione el lugar de entrega.' : 'Please select delivery place.';
        this.api.presentToast(message);
        return;
      }
      if (!this.selectedDate.length) {
        // this.api.presentToast('Please select delivery hour.');
        var message = this.translate.defaultLang == 'es' ? 'Por favor seleccione hora de entrega.' : 'Please select delivery hour.';
        this.api.presentToast(message);
        return;
      }
      let params: any = {
        place: this.selectedPlace,
        deliveryDate: this.selectedDate,
      }
      if (this.comments.length) {
        params.comment = this.comments;
      }
      localStorage.setItem('deliveryData', JSON.stringify(params));
      localStorage.setItem('comment', JSON.stringify(params.comment));
      // console.log(JSON.parse(localStorage.getItem('comment')))
      // this.navCtrl.navigateForward('/products', params);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          delivery: JSON.stringify(params)
        }
      };
      this.router.navigate(['/products'], navigationExtras);
    }, 200);
  }

}
