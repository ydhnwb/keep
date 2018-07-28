import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController, Loading, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider }from '../../providers/dataservice/dataservice';

/**
 * Generated class for the ListperangkatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listperangkat',
  templateUrl: 'listperangkat.html',
})
export class ListperangkatPage {
  header : any = {};
  data : any = [];
  toaster: any;
  loading: Loading;
  host : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http : HTTP,
              private alertCtrl : AlertController, public dataService: DataserviceProvider, 
              private zone : NgZone, public toastCtrl : ToastController, public loadingCtrl : LoadingController) {
                this.toaster = this.toastCtrl.create({
                  duration: 2000,
                  position: 'bottom'
                });
                this.host = dataService.uploads;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListperangkatPage');
  }

  ionViewDidEnter(){
    this.getAllData();
  }

  getAllData(){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.get(this.dataService.mHost+'getperangkat.php', {}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("Get All Data : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OKE']
    });
    alert.present();  
  }

  seeData(qrcode, e){
    e.preventDefault();
    e.stopPropagation();
    this.navCtrl.push('UpdatePage',{scanned : qrcode.toLowerCase()});
  }

  intentEdit(id_perangkat){
    this.navCtrl.push('InsertPage', {scanned : id_perangkat.toLowerCase(),isUpdate : true});
  }
}
