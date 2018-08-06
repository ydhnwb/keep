import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, AlertController, Loading, ToastController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';
import { Platform } from 'ionic-angular/platform/platform';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

/**
 * Generated class for the ListphotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-listphoto',
  templateUrl: 'listphoto.html',
})
export class ListphotoPage {
  loading: Loading;
  images : any = [];
  qrcode : string = '';
  header : any = {};
  toaster : any;
  host : string = '';  
  lastImage: string = null;
  nama_perangkat :  string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public http : HTTP,
              public zone : NgZone, public loadingController : LoadingController, public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, private alertCtrl : AlertController, public dataserv : DataserviceProvider,
              public toastCtrl : ToastController, private camera: Camera, private transfer: Transfer, private file: File,private filePath: FilePath,
              public platform: Platform) {
                this.host = dataserv.uploads;
                this.toaster = this.toastCtrl.create({
                  duration: 3000,
                  position: 'bottom'
                });
                this.qrcode = navParams.get('qrcode');
                this.nama_perangkat = navParams.get('nama_perangkat');
              }

  ionViewDidEnter(){
    this.getImages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListphotoPage');
  }

  getImages(){
    this.http.post(this.dataserv.mHost+'getimages.php', {image_id : this.qrcode}, this.header)
        .then(res => {
        try {
            this.images = JSON.parse(res.data);
        }catch(e) {
            console.error('JSON parsing error '+ e.message);
            this.showAlert('Exception', e.message);
        }
        }).catch(e => {
            console.log("getImages : " + e.message);
            this.showAlert('Get images', e.message);
        });
  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OK']
    });
    alert.present();  
  }

  public popUpOption(id, qrcode) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih opsi',
      buttons: [{
          text: 'Ganti foto dari kamera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, id);
          }
        },
        {
          text: 'Ganti foto dari galeri',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, id);
          }
        },
        {
          text: 'Hapus foto ini',
          handler: () => {
            if(this.images.length === 1){
              this.showAlert('Info','Setidaknya anda perlu menyisakan satu foto');
            }else{
              this.deletePhotoFromDatabase(id,qrcode);
            }
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


  deletePhotoFromDatabase(id, qrcode){
    this.loading = this.loadingCtrl.create({
                content: 'Menghapus...',
              });
              this.loading.present();
              this.http.post(this.dataserv.mHost+'deletesomeimage.php', {id : id}, this.header)
              .then(res => {
              try {
                  this.images = JSON.parse(res.data);
                  this.toaster.setMessage('Dihapus');
                  this.toaster.present();
                  while(this.images.length > 0) {
                    this.images.pop();
                  }
                  this.getImages();
                  this.loading.dismissAll();
              }catch(e) {
                  this.loading.dismissAll();
                  console.error('JSON parsing error '+ e.message);
                  this.showAlert('Exception', e.message);
              }
              }).catch(e => {
                  this.loading.dismissAll();
                  console.log("deleteimage : " + e);
                  this.showAlert('Get images exception', e);
              });
  }

  public takePicture(sourceType, id) {
    var options = {
      quality: 20,
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
            this.copyFileToLocalDir(id, correctPath, currentName, this.createFileName());  
          })
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(id, correctPath, currentName, this.createFileName());
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

  private copyFileToLocalDir(id, namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      //this.lastImage = newFileName;
      this.uploadImageTwo(id, newFileName)  
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
  
  public uploadImageTwo(id, newFileName) {
    if(this.lastImage !== null){
      //do something
      this.showAlert('Info', 'Last image is null');
    }else{
      this.loading = this.loadingCtrl.create({
        content: 'Tunggu sebentar...',
      });
      this.loading.present();
      //var targetPath = this.pathForImage(this.lastImage);
      var targetPath = this.pathForImage(newFileName);
      var filename = newFileName;   
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename}
      };
      
      const fileTransfer: TransferObject = this.transfer.create();
      fileTransfer.upload(targetPath, this.dataserv.mHost+'imageuploader.php', options).then(data => {
        this.loading.dismissAll()
        let s = data.response;
        if(id === -1){
          //do add
          this.http.post(this.dataserv.mHost+'imagepusher.php', {image_id : this.qrcode, image_uri : s}, this.header)
          .then( result => {
            try{
              while(this.images.length > 0) {
                this.images.pop();
              }
              this.getImages();
              this.loading.dismissAll();
              let t = JSON.parse(result.data);
              this.toaster.setMessage("Berhasil");
              this.toaster.present();
            }catch(e){
              console.log(e);
              this.loading.dismissAll();
              this.showAlert('pushImage',e);
            }
          });          

        }else{
          this.http.post(this.dataserv.mHost+'imageupdater.php', {id : id, image_id : this.qrcode, image_uri : s}, this.header)
          .then( result => {
            try{
              let t = JSON.parse(result.data);
              while(this.images.length > 0) {
                this.images.pop();
              } 
              this.lastImage = null;
              this.getImages();
              this.loading.dismissAll();
              this.toaster.setMessage(t.message);
              this.toaster.present();
            }catch(e){        
              this.lastImage = null;
              this.loading.dismissAll();
              console.log(e);
              this.showAlert('pushImage',e);
            }
          });
        }
                  
      }, err => {
        this.lastImage = null;
        this.showAlert('Error update', err.message);
        console.log(err.message);
        this.loading.dismissAll();
        });
  
  
    }

  }

  public presentAdd() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih gambar',
      buttons: [{
          text: 'Dari galeri',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, -1);
          }
        },
        {
          text: 'Kamera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, -1);
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

}
