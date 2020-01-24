import { Component, OnInit ,ViewChild} from '@angular/core';
import { NavParams,Events, ModalController,IonSlides} from '@ionic/angular';
@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.page.html',
  styleUrls: ['./productdetails.page.scss'],
})
export class ProductdetailsPage implements OnInit {
  @ViewChild('productdetailSlide', { static: false }) productdetailSlide: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    autoplay: false,
    pager: true
  };
data:any='';
  constructor(public navParams:NavParams,public modalCtrl: ModalController) {
    this.data = this.navParams.get('data');
    console.log(  this.data);
    // this.productdetailSlide.slideNext(0)
   }
   ionViewWillEnter(){
    this.productdetailSlide.update();
    }
 
  ngOnInit() {
   
  }
  slidePrev(evt) {
   
    console.log(evt)
    this.productdetailSlide.slidePrev();
  }
  slideNext(evt) {
    this.productdetailSlide.slideNext();
  }
  close(){
    this.modalCtrl.dismiss();
  }
}
