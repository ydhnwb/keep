import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  
  kategori : any = [];
  header:any = {};
  options : BarcodeScannerOptions;
  encodetext : string = '';
  encodeData : any = {};
  scannedData : any = {};
  isProhibited = false;

  part : any = [];

  constructor(public zone : NgZone, public navCtrl: NavController, public navParams: NavParams, public http : HTTP, public scanner : BarcodeScanner,
              public dataservice : DataserviceProvider, public alertCtrl : AlertController) {
                this.selectedItem = navParams.get('item');

  }


  ionViewDidLoad(){
    this.getDataKategori();
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OKE']
    });
    alert.present();  
  }

  getDataKategori(){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.get(this.dataservice.mHost+'getkategori.php', {}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.kategori = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("getDataKategori : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }


  getChildrenOfCategory(value){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.post(this.dataservice.mHost+'partcategorized.php', {id : value}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.part = JSON.parse(res.data);
            //console.log(this.data);
            });
        }).catch(e => {
            console.log("Get All Data : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  intentListPart(e){
    this.navCtrl.push('ListpartPage',{ctx : e}); 
  }
}
