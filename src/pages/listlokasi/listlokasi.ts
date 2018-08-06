import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';

/**
 * Generated class for the ListlokasiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listlokasi',
  templateUrl: 'listlokasi.html',
})
export class ListlokasiPage {

  data : any =[];
  header : any = {};
  id_area : string = '';
  nama_area : string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP,
              public zone : NgZone, public dataservice : DataserviceProvider) {
                this.id_area = navParams.get('id_area');
                this.nama_area = navParams.get('nama_area');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListlokasiPage');
    this.getLokasi();
  }

  getLokasi(){
    this.http.post(this.dataservice.mHost+'getfilteredlokasi.php', {id_area : this.id_area}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.data = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("getarea : " + e.message);
        });
  }

  intentPerangkatFilter(id_lokasi, nama_lokasi){
    this.navCtrl.push('ListperangkatPage',{id_area : this.id_area, nama_area : this.nama_area, id_lokasi : id_lokasi, nama_lokasi : nama_lokasi, isFiltering : true}); 
  }

}
