import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';
import { HTTP } from '../../../node_modules/@ionic-native/http';

/**
 * Generated class for the ListpartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listpart',
  templateUrl: 'listpart.html',
})
export class ListpartPage {

  ctx : '';
  header : any = {};
  data : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl : AlertController,
              public dataservice : DataserviceProvider, public http : HTTP, public zone : NgZone) {
                this.ctx = this.navParams.get('ctx');
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter(){
    this.getAllData(this.ctx);
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OK']
    });
    alert.present();  
  }

  getAllData(ctgr){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.post(this.dataservice.mHost+'partcategorized.php', {id : ctgr}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("Get All Data Error : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }
  
  intentEdit(id_part){ 
    this.navCtrl.push('PartPage', {id : id_part,isUpdate : true});
  }

  seeData(qrcode, e){
    e.preventDefault();
    e.stopPropagation();
    this.navCtrl.push('UpdatePage',{scanned : qrcode.toLowerCase()});
  }
}
