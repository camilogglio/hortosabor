import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AlertController,Events} from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
declare var $:any;
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  historyData:any=[];
  phone_number:any='';
  dial_code:any='';
  noData:boolean;
  timestamp:any='';
  constructor(public translate: TranslateService,public route:ActivatedRoute,public api:ApiService, public alertController:AlertController, public events:Events,private transfer: FileTransfer, private file: File) { 
    this.historyData=[];
    this.noData = false;
  }
  ngOnInit() {
    $(".accordion__answer:first").show();
    $(".accordion__question:first").addClass("expanded");
    // var phone = document.getElementById("mobileno");
    setTimeout(() => {
      $("#historymobileno").intlTelInput({
        hiddenInput: "phone-no",
        initialCountry: "ar",
        utilsScript: "assets/js/utils.js"
      });
      // $("#mobileno").usPhoneFormat();
    }, 100);

  }
    ionViewDidEnter(){
    this.phone_number ='';
    this.historyData=[];
    this.noData = false;
  }
  CheckPhoneNumber(){
    console.log(this.phone_number, "phonenumner")
      if(this.phone_number !=''){
        this.orderHistory();
      }else{
        // this.api.presentToast("Phone Number is required.")
        var message = this.translate.defaultLang == 'es' ? 'Número de teléfono requerido.' : 'Phone Number is required.' ;
        this.api.presentToast(message);
      }
  }
  updatephone(evn){
    console.log(evn.target.value);
    var s =evn.target.value;
    var t=s.replace(/^0+/, '');
    console.log(t);
    this.phone_number =t;
  }
  download(data) {
   
    this.timestamp= Math.round((new Date()).getTime() / 1000);
      const url = data.filePath;
      let finalurl = encodeURI(url);
      const fileTransfer: FileTransferObject = this.transfer.create();
      // console.log(this.file.externalDataDirectory  + '/downloads/status.pdf');
      this.file.checkDir(this.file.externalDataDirectory , 'downloads')
      .then(_ => {
        console.log("iff")
          fileTransfer.download(finalurl, this.file.externalDataDirectory  + 'downloads/status_'+data.order_number+'_'+this.timestamp+'.pdf').then((entry) => {
            
            var message = this.translate.defaultLang == 'es' ? 'Archivo guardado en: ' : 'File saved in : ' ;
            this.api.presentToast(message + entry.nativeURL);
            let url = entry.toURL();
           
          })
          .catch((err) =>{
            var message = this.translate.defaultLang == 'es' ? 'Error al guardar el archivo: ' : 'Error saving file : ' ;
            this.api.presentToast(message + err.message);
            // alert('Error saving file: ' + err.message);
          })
        }
      )
      .catch(
        // Directory does not exists, create a new one
        err => this.file.createDir(this.file.externalDataDirectory , 'downloads', false)
        .then(response => {
          this.api.presentToast(' created:  ' + response.fullPath);
          fileTransfer.download(finalurl, this.file.externalDataDirectory  + 'downloads/status_'+data.order_number+'_'+this.timestamp+'.pdf').then((entry) => {
              //alert('File saved in : ' + entry.nativeURL);
              var message = this.translate.defaultLang == 'es' ? 'Archivo guardado en: ' : 'File saved in : ' ;
            this.api.presentToast(message + entry.nativeURL);
            })
            .catch((err) =>{
              //alert('Error saving file:  ' + err.message);
              var message = this.translate.defaultLang == 'es' ? 'Error al guardar el archivo: ' : 'Error saving file : ' ;
              this.api.presentToast(message + err.message);
            });		
        }).catch(err => {
          var message = this.translate.defaultLang == 'es' ? 'No fue posible crear el directorio "descargas". Errar: ' : 'It was not possible to create the dir "downloads". Err : ' ;
            this.api.presentToast(message + err.nativeURL);
          // alert('It was not possible to create the dir "downloads". Err: ' + err.message);
        })			
      );  
    }
  orderHistory(){
  var phone = document.getElementById("historymobileno");
    var country = $(phone).intlTelInput("getSelectedCountryData").dialCode;
    if (this.phone_number) {
      console.log("+" + country);
      var dialcode = "+" + country;
    }
    var full_number = dialcode + this.phone_number;
    console.log(full_number)
    var data={
      phone_number: full_number
    }
  const url = '/order_history';
  this.api.post(url, data).subscribe(res => {
    console.log('res:- ', res);   
    if(res.error){
      this.noData = true; 
      this.historyData = [];     
    }else{
      this.noData = false; 
      this.historyData = res.orders_final;
    }     
  }, err => {
    console.log('err:- ', err);
  });
}

}
