import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController, Loading, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider }from '../../providers/dataservice/dataservice';


/**
 * Generated class for the UpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})
export class UpdatePage {

  header : any = {};
  data : any = [];
  scannedData : '';
  toaster: any;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http : HTTP,
              private alertCtrl : AlertController, public dataService: DataserviceProvider, 
              private zone : NgZone, public toastCtrl : ToastController, public loadingCtrl : LoadingController) {
                this.scannedData = this.navParams.get('scanned');
                this.toaster = this.toastCtrl.create({
                  duration: 2000,
                  position: 'bottom'
                });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad UpdatePage');
    this.getAllData(this.scannedData);
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OKE']
    });
    alert.present();  
  }

  getAllData(scannedData){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.post(this.dataService.mHost+'data.php', {id : scannedData.toLowerCase()}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            //console.log(this.data);
            });
        }).catch(e => {
            console.log("Get All Data : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  getStatus(status){
    return status == '1';
  }

  intentPart(){
    this.navCtrl.push('PartPage', {id : this.scannedData, isUpdate : false});
  }

  finish(){
    setTimeout( () =>{
      this.navCtrl.pop();
    }, 400)    
  }


  insertNewRecordOfData(){
    this.loading = this.loadingCtrl.create({
      content: 'Menyimpan..',
    });
    this.loading.present();

      this.http.post(this.dataService.mHost+'detail.php', {data : this.data}, this.header)
      .then( result => {
        try{
          this.toaster.setMessage('Disimpan');
          this.toaster.present();          
        }catch(e){
          console.log(e.message);
          this.showAlert('Oops', e.message);
        }
        this.loading.dismissAll();
        this.finish();
      });
  } 
  
  

}
