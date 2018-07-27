import { Component, NgZone } from '@angular/core';
import { IonicPage, ActionSheetController, NavController,ToastController, NavParams, AlertController,LoadingController,Loading, Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the InsertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-insert',
  templateUrl: 'insert.html',
})
export class InsertPage {

  data : any={
    qrcode : '',
    nama : '',
    deskripsi : '',
    area : '',
    lokasi : '',
    imagepath : ''
  }

  
  header : any = {};
  options : BarcodeScannerOptions;
  encodetext : string = '';
  encodeData : any = {};
  scannedData : '';
  loading: Loading;
  toaster: any;
  lastImage: string = null;
  isUpdate: false;
  host : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http : HTTP,
              public loadingController : LoadingController, public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, private alertCtrl : AlertController, public dataserv : DataserviceProvider,
              public scanner : BarcodeScanner, public zone : NgZone, public toastCtrl : ToastController,
              private camera: Camera, private transfer: Transfer, private file: File,private filePath: FilePath,
              public platform: Platform) {
                  
                this.scannedData = this.navParams.get('scanned');
                this.isUpdate = this.navParams.get('isUpdate');
                this.data.qrcode = this.scannedData;
                this.toaster = this.toastCtrl.create({
                  duration: 2000,
                  position: 'bottom'
                });
                this.host = this.dataserv.uploads;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsertPage');
  }

  ionViewDidEnter(){
    if(this.data.qrcode == ''){
      this.getRandomQrCode();
    }
    if(this.isUpdate){
      this.getProp();
    }
  }

  saveData(){
    if(this.checker()){
      this.insertData();
    }else{
      this.showAlert('Oops', 'Isi semua data terlebih dahulu');
    }
  }

  checker(){
    return this.data.nama != '' && this.data.deskripsi != '' && this.data.area != '' && this.data.lokasi != '';
  }
  
  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OK']
    });
    alert.present();  
  }

  insertData(){
    this.loading = this.loadingCtrl.create({
      content: 'Menyimpan...',
    });
    
    var data : any =[];
    this.loading.present();
    this.http.post(this.dataserv.mHost+'perangkat.php', this.data, this.header)
      .then( result => {
        try{
          data = JSON.parse(result.data);
          this.loading.dismissAll();
          //this.toaster.setMessage("Data anda berhasil disimpan");
          this.toaster.present();
          this.clearAll();
          this.finish();        
          this.encode(data.message);
          
        }catch(e){
          this.loading.dismissAll();
          console.log(e);
          this.showAlert('Eksepsi', "Kode error : " +e);
        }
      });
  }

  encode(encoded){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, encoded).then((data) => {
      this.encodeData = data;
    }, (err) => {
      console.log("Error : " +err);
    })
  }

  getRandomQrCode(){
    var randomString : any = [];
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.get(this.dataserv.mHost+'randomstring.php', {}, this.header)
        .then(res => {
            this.zone.run(() => {
            randomString = JSON.parse(res.data);
            this.data.qrcode = randomString.message;
            });
        }).catch(e => {
            console.log(e);
            this.showAlert('getRandom', e.message);
        });
  }

  clearAll(){
    this.data.qrcode = '';
    this.data.nama = '';
    this.data.deskripsi = '';
    this.data.area = '';
    this.data.lokasi = '';
    this.data.image = '';
    this.lastImage = null;
    if(this.data.qrcode == ''){
      this.getRandomQrCode();
    }
  }

  getProp(){
    this.header['Cache-Control'] = 'no-cache';
    this.http.clearCookies();
    this.http.post(this.dataserv.mHost+'perangkatprop.php', this.data, this.header)
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

  updateData(){
    this.loading = this.loadingCtrl.create({
      content: 'Memperbarui...',
    });
    var data : any =[];
    this.loading.present();
    this.http.post(this.dataserv.mHost+'updateperangkat.php', this.data, this.header)
      .then( result => {
        try{
          data = JSON.parse(result.data);
          this.loading.dismissAll();
          this.toaster.setMessage(data.message);
          this.toaster.present();
          this.clearAll();        
          this.finish();
        }catch(e){
          this.loading.dismissAll();
          console.log(e);
          this.showAlert('Kesalahan', "error : " +e);
        }
      });
  }

  finish(){
    setTimeout( () =>{
      this.navCtrl.pop();
    }, 300)    
  }

  public takePicture(sourceType) {
    var options = {
      quality: 30,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          })
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      console.log(err.message);
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.toaster.setMessage(error.message);
      this.toaster.present();
    });
  }
  
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImageTwo() {
    if(this.checker()){
      if(this.lastImage == null || typeof this.lastImage === 'undefined'){
          this.updateData();
      }else{
        var targetPath = this.pathForImage(this.lastImage);
        var filename = this.lastImage;   
        var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params : {'fileName': filename}
        };
        const fileTransfer: TransferObject = this.transfer.create();
        this.loading = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loading.present();
       
        fileTransfer.upload(targetPath, this.dataserv.mHost+'imageuploader.php', options).then(data => {
          this.loading.dismissAll()
          let s = data.response;
          this.data.imagepath = s;
          if(this.isUpdate){
            this.updateData();
          }else{
            this.saveData();
          }
        }, err => {
          this.showAlert('Error update', err.message);
          console.log(err.message);
          this.loading.dismissAll();
          this.toaster.setMessage("gagal mengupload foto");
          this.toaster.present();
        
        });
      }
  
    }

  }

  deleteData(){
    this.loading = this.loadingCtrl.create({
      content: 'Menghapus...',
    });
    this.loading.present();

    this.http.post(this.dataserv.mHost+'deleteperangkat.php', {qrcode : this.data.qrcode}, this.header)
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

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ambil gambar',
      buttons: [{
          text: 'Dari galeri',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Kamera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Batal',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Hapus',
      message: 'Apakah anda yakin? Semua part yang berhubungan juga akan dihapus.',
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
