import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AlertController,Events} from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(public route:ActivatedRoute,public api:ApiService, public alertController:AlertController, public events:Events,private transfer: FileTransfer, private file: File) { 
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

  }
    ionViewDidEnter(){
      this.phone_number ='';
    this.historyData=[];
  }
  CheckPhoneNumber(){
    console.log(this.phone_number, "phonenumner")
      if(this.phone_number !=''){
        this.orderHistory();
      }else{
        this.api.presentToast("Phone Number is required.")
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
            this.api.presentToast('File saved in :  ' + entry.nativeURL);
            let url = entry.toURL();
           
          })
          .catch((err) =>{
            alert('Error saving file: ' + err.message);
          })
        }
      )
      .catch(
        // Directory does not exists, create a new one
        err => this.file.createDir(this.file.externalDataDirectory , 'downloads', false)
        .then(response => {
          this.api.presentToast('New folder created:  ' + response.fullPath);
          fileTransfer.download(finalurl, this.file.externalDataDirectory  + 'downloads/status_'+data.order_number+'_'+this.timestamp+'.pdf').then((entry) => {
              alert('File saved in : ' + entry.nativeURL);
            })
            .catch((err) =>{
              alert('Error saving file:  ' + err.message);
            });		
        }).catch(err => {
          alert('It was not possible to create the dir "downloads". Err: ' + err.message);
        })			
      );  
    }
  orderHistory(){
  var phone = document.getElementById("mobileno");
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
