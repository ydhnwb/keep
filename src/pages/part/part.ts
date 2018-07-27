import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';
 

/**
 * Generated class for the PartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-part',
  templateUrl: 'part.html',
})
export class PartPage {
 
  data : any = {
    id:'',
    nama : '',
    deskripsi : '',
    category : '1'
  }

  kategori : any = [];
  header : any = {};
  id_perangkat : '';
  isUpdate : false;
  toaster: any;
  lastImage: string = null;
  loading: Loading;

  constructor(public zone : NgZone, public navCtrl: NavController, public navParams: NavParams, private http : HTTP, private alertCtrl : AlertController,
              private loadingCtrl : LoadingController, private dataserv : DataserviceProvider,private toasterCtrl : ToastController) {
                this.toaster = this.toasterCtrl.create({
                  duration: 2000,
                  position: 'bottom'
                });
                this.data.id = this.navParams.get('id');
                this.isUpdate = this.navParams.get('isUpdate');
  }

  ionViewDidLoad() {
    this.getCategory();
    console.log('ionViewDidLoad PartPage');
    if(this.isUpdate){
      this.getProp();
    }
  }

  insertData(){
    let n = this.data.nama.toLowerCase();
    let c = this.data.category;
    if(this.checker(n,c)){
      this.loading = this.loadingCtrl.create({
        content: 'Menyimpan part...',
      });
      this.loading.present();
      this.http.post(this.dataserv.mHost+'part.php', this.data, this.header)
        .then( result => {
          try{
            this.data = JSON.parse(result.data);
            this.toaster.setMessage('Data berhasil disimpan');
            this.toaster.present();
          }catch(e){
            console.log("Error insert part : " + e.message);
            this.showAlert('Kesalahan', e.message);
          }
          this.loading.dismissAll();
          this.finish();
        });
    }else{
      this.showAlert('Oops', 'Please fill all forms first');
    }
  }

  finish(){
    setTimeout( () =>{
      this.navCtrl.pop();
    }, 300)    
  }

  checker(n,c) : boolean {
    return n != '' && c != '';
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OK']
    });
    alert.present();  
  }

  getCategory(){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.get(this.dataserv.mHost+'getkategori.php', {}, this.header)
        .then(res => {
            this.zone.run(() => {
            this.kategori = JSON.parse(res.data);
            });
        }).catch(e => {
            console.log("getCategory : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  updateData(){
    let n = this.data.nama.toLowerCase();
    let c = this.data.category;
    if(this.checker(n,c)){
      this.loading = this.loadingCtrl.create({
        content: 'Memperbarui part...',
      });
      this.loading.present();
      this.http.post(this.dataserv.mHost+'updatepart.php', this.data, this.header)
        .then( result => {
          try{
            this.data = JSON.parse(result.data);
            this.toaster.setMessage('Data berhasil diperbarui');
            this.toaster.present();
          }catch(e){
            console.log("Error update part : " + e.message);
            this.showAlert('Kesalahan', e.message);
          }
          this.loading.dismissAll();
          this.finish();
        });
    }else{
      this.showAlert('Oops', 'Please fill all forms first');
    }
  }

  getProp(){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.post(this.dataserv.mHost+'getpart.php', {id : this.data.id}, this.header)
        .then(res => {
        try {
            this.data = JSON.parse(res.data)[0];
        }catch(e) {
            console.error('JSON parsing error '+ e.message);
            this.showAlert('Exception', e.message);
        }
        }).catch(e => {
            console.log("getProp : " + e.message);
            this.showAlert('Terjadi kesalahan', e.message);
        });
  }

  deleteData(){
    this.loading = this.loadingCtrl.create({
      content: 'Menghapus part...',
    });
    this.loading.present();

    this.http.post(this.dataserv.mHost+'delete.php', {id :this.data.id , target : 'part'}, this.header)
    .then(( res => {
      try{
        var data = JSON.parse(res.data);
        this.toaster.setMessage(data.message);
        this.toaster.present();
      }catch(e){
        this.showAlert('Error Eksepsi', e);
        console.error('JSON parse error');
      }
      this.loading.dismissAll();
      this.finish();
    }));
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Hapus',
      message: 'Apakah anda yakin ingin menghapus part ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'HAPUS',
          handler: () => {
            this.deleteData();
            console.log('delete clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
