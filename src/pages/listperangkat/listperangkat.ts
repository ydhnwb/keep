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
  isFiltering = false;
  id_area : string = '';
  id_lokasi : string = '';
  nama_area : string = '';
  nama_lokasi : string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private http : HTTP,
              private alertCtrl : AlertController, public dataService: DataserviceProvider, 
              private zone : NgZone, public toastCtrl : ToastController, public loadingCtrl : LoadingController) {
                this.toaster = this.toastCtrl.create({
                  duration: 2000,
                  position: 'bottom'
                });
                this.host = dataService.uploads;
                this.isFiltering = navParams.get('isFiltering');
                if(this.isFiltering){
                  this.id_area = navParams.get('id_area');
                  this.id_lokasi = navParams.get('id_lokasi');
                  this.nama_area = navParams.get('nama_area');
                  this.nama_lokasi = navParams.get('nama_lokasi');
                }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListperangkatPage');
  }

  ionViewDidEnter(){
    if(this.isFiltering){
      this.getFilteredData();
    }else{
      this.getAllData();
    }
  }

  getFilteredData(){
    this.http.post(this.dataService.mHost+'getfilteredperangkat.php', {id_area : this.id_area, id_lokasi : this.id_lokasi}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("Get All Data : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  getAllData(){
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
