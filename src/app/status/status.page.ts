import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AlertController,Events} from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  ordersData:any=[];
  status:any='';
  timestamp:any='';
  enterTranslate:any='';
  verificationTranslate:any='';
  cancelTranslate:any='';
  okTranslate:any='';
  statusArray=['Order received','Preparing','On the way','Delivered'];
  constructor(public translate: TranslateService,public route:ActivatedRoute,public api:ApiService, public alertController:AlertController, public events:Events,private transfer: FileTransfer, private file: File) { 
    // this.events.subscribe('status:created', (time) => {
    //   this.presentAlertPrompt();
    // });
    this.route.queryParams.subscribe(params => {
      if (params && params.value) {
        var newData = {
          verify_no: JSON.parse(params.value)
        }
        this.order(newData);
      }else{
        this.ordersData=[];
        this.status=''
       this.presentAlertPrompt();
      }
    })
   
  }
  // ionViewDidEnter(){
  //   this.ordersData='';
  //     this.status=''
  //   this.presentAlertPrompt();
  // }
  ngOnInit() {

    // this.presentAlertPrompt();
  }
  order(data){
      const url = '/order_info';
    this.api.post(url, data).subscribe(data => {
      console.log('res:- ', data.orders);   
      if(data.orders_final.orders.length == 0){
        this.ordersData = [];
        this.status = this.translate.defaultLang == 'es' ? 'No se encontró orden' : 'No Order Found' ;
        console.log(this.ordersData, this.status)
      }else{
        this.ordersData = data.orders_final;
      }     
    }, err => {
      console.log('err:- ', err);
    });
  }
  download() {
    this.api.showLoader();
  this.timestamp= Math.round((new Date()).getTime() / 1000);
    const url = this.ordersData.filePath;
    let finalurl = encodeURI(url);
    const fileTransfer: FileTransferObject = this.transfer.create();
    // console.log(this.file.externalDataDirectory  + '/downloads/status.pdf');
  	this.file.checkDir(this.file.externalDataDirectory , 'downloads')
		.then(_ => {
      setTimeout(()=>{
        this.api.hideLoader();
      },500)
      console.log("iff")
        fileTransfer.download(finalurl, this.file.externalDataDirectory + 'downloads/status_'+ this.ordersData.order_number+'_'+this.timestamp+'.pdf').then((entry) => {
          // this.api.presentToast('File saved in :  ' + entry.nativeURL);
          // this.api.presentToast('File saved in :  ' + entry.nativeURL);
          var message = this.translate.defaultLang == 'es' ? 'Archivo guardado en: ' : 'File saved in : ' ;
          this.api.presentToast(message + entry.nativeURL);
          let url = entry.toURL();
         
        })
        .catch((err) =>{
          // alert('Error saving file: ' + err.message);
          var message = this.translate.defaultLang == 'es' ? 'Error al guardar el archivo: ' : 'Error saving file : ' ;
          this.api.presentToast(message + err.message);
        })
      }
		)
		.catch(      
			// Directory does not exists, create a new one
      err =>{
        setTimeout(()=>{
          this.api.hideLoader();
        },500)
         this.file.createDir(this.file.externalDataDirectory , 'downloads', false)
        .then(response => {
          var message = this.translate.defaultLang == 'es' ? 'Nueva carpeta creada:' : 'New folder created: ';
               this.api.presentToast(message + response.fullPath);
          fileTransfer.download(finalurl, this.file.externalDataDirectory  + 'downloads/status_'+this.timestamp+'.pdf').then((entry) => {
              // alert('File saved in : ' + entry.nativeURL);
              var message = this.translate.defaultLang == 'es' ? 'Archivo guardado en: ' : 'File saved in : ' ;
              this.api.presentToast(message + entry.nativeURL);
            })
            .catch((err) =>{
              // alert('Error saving file:  ' + err.message);
              var message = this.translate.defaultLang == 'es' ? 'Error al guardar el archivo: ' : 'Error saving file : ' ;
              this.api.presentToast(message + err.message);
            });		
        }).catch(err => {
          // alert('It was not possible to create the dir "downloads". Err: ' + err.message);
          var message = this.translate.defaultLang == 'es' ? 'No fue posible crear el directorio "descargas". Errar: ' : 'It was not possible to create the dir "downloads". Err : ' ;
          this.api.presentToast(message + err.nativeURL);
        })		
      }    	
		);  
  }
  async presentAlertPrompt() {
    this.translate.get('enter').subscribe(
      value => {
        // value is our translated string
        this.enterTranslate = value;
      }
    )
    this.translate.get('verification_number').subscribe(
      value => {
        // value is our translated string
        this.verificationTranslate = value;
      }
    )
    this.translate.get('cancel').subscribe(
      value => {
        // value is our translated string
        this.cancelTranslate = value;
      }
    )
    this.translate.get('ok').subscribe(
      value => {
        // value is our translated string
        this.okTranslate = value;
      }
    )
    
    const alert = await this.alertController.create({
      header:  this.enterTranslate,
      inputs: [
        {
          name: 'verify_no',
          type: 'text',
          placeholder: this.verificationTranslate
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
              // this.api.presentToast('Enter verification number.')
              var message = this.translate.defaultLang == 'es' ? 'Ingrese el número de verificación.' : 'Enter verification number.' ;
      this.api.presentToast(message);
              return false
            }else{
              var newData = {
                verify_no: data.verify_no
              }
              this.order(data);

            }
          }
        }
      ]
    });

    await alert.present();
  }
}
