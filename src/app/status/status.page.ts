import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AlertController,Events} from '@ionic/angular';
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  ordersData:any='';
  status:any=''
  constructor(public api:ApiService, public alertController:AlertController, public events:Events) { 
    // this.events.subscribe('status:created', (time) => {
    //   this.presentAlertPrompt();
    // });
   
  }
  ionViewDidEnter(){
    this.presentAlertPrompt();
  }
  ngOnInit() {

    // this.presentAlertPrompt();
  }
  order(data){
      const url = '/order';
    this.api.post(url, data).subscribe(data => {
      console.log('res:- ', data.orders);   
      if(data.orders =='Result Not Found'){
        this.status= "No Order Found";
      }else{
        this.ordersData = data.orders;
      }     
    }, err => {
      console.log('err:- ', err);
    });
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Enter',
      inputs: [
        {
          name: 'verify_no',
          type: 'text',
          placeholder: 'Verification Number'
        }        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            if(data.verify_no == ''){
              this.api.presentToast('Enter verification number.')
              return false
            }else{
              this.order(data);

            }
          }
        }
      ]
    });

    await alert.present();
  }
}
