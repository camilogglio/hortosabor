import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { Http, HttpModule, RequestOptions, Headers } from '@angular/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://35.182.9.201/hortosabor/index.php/Api';
  loading: any;
  constructor(
    public http: Http,
    public HttpC: HttpClient,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController
  ) { }

  async showLoader() {
    this.loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'api-loader'
    });
    return await this.loading.present();
  }

  async hideLoader() {
    console.log(this.loading);
    return await this.loading.dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      color: 'dark',
      duration: 3000
    });
    toast.present();
  }

  public post(url, params) {
    const headers = new Headers();
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(this.url + url, JSON.stringify(params), options)
      .map(res => res.json());
  }

  public get(url, params) {
    const headers = new Headers();
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.url + url, options).map(res => res.json());
  }
}
