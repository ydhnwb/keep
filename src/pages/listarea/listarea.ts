import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';

/**
 * Generated class for the ListareaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listarea',
  templateUrl: 'listarea.html',
})
export class ListareaPage {

  data : any = [];
  header : any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP,
              public dataservice : DataserviceProvider, public zone : NgZone) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListareaPage');
    this.getArea();
  }

  getArea(){
    this.http.get(this.dataservice.mHost+'getarea.php', {}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("getarea : " + e.message);
        });
  }

  intentListLokasi(id_area, area){
    this.navCtrl.push('ListlokasiPage',{id_area : id_area, nama_area : area}); 
  }

}
