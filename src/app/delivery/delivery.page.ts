import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController,MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '../api.service';
import { Router, RouterEvent, NavigationEnd, NavigationExtras } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
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
    public navCtrl: NavController,
    public storage: Storage,
    public api: ApiService,
    public router: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
   
  ) { }

  ngOnInit() {
 
    this.getDeliveryPlaces();
    this.loadMap();
  }

  loadMap(lat?: any, lng?: any) {
    if(lat && lng) {
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
    var goldenGatePosition = {lat: this.map.center.lat(),lng: this.map.center.lng()};
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

  getDeliveryPlaces() {
    this.api.showLoader();
    const url = '/locations';
    const params = {};
    this.api.get(url, params).subscribe(data => {
      setTimeout(() => {
        this.api.hideLoader();
      }, 100);
      console.log('Places res:- ', data);
      if (data.locations) {
        this.places = data.locations;
      }
    }, err => {
      setTimeout(() => {
        this.api.hideLoader();
      }, 100);
      console.log('Places err:- ', err);
    });
  }

  changeDeliveryPlace(evt) {   
    this.selectedPlaceDate = {};
    console.log('selected delivery:- ', this.selectedPlace);
    var result = this.places.filter(x => x.id === this.selectedPlace).map(x => x);
    console.log('result:- ', result);
    if(result.length>0){
      this.selectedPlaceDate = result[0];
      this.selectedDate = '';
      this.loadMap(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
      // this.getAddressFromCoords(parseFloat(this.selectedPlaceDate.latitude), parseFloat(this.selectedPlaceDate.longitude));
      this.changeDeleveryTime();
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
    // this.intervalDate.push(this.timeInterval + '-' + ((month).toString().length > 1 ? month : '0'+month) + '-' + year);
    this.api.hideLoader();
    setTimeout(() => {
      this.api.hideLoader();
    }, 500);
  }

  confirm() {
    setTimeout(() => {
      if (!this.selectedPlace.length) {
        this.api.presentToast('Please select delivery place.');
        return;
      }
      if (!this.selectedDate.length) {
        this.api.presentToast('Please select delivery hour.');
        return;
      }
      let params: any = {
        place: this.selectedPlace,
        deliveryDate: this.selectedDate,
      }
      if (this.comments.length) {
        params.comment = this.comments;
      }
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
