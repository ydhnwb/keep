import { Component, NgZone } from '@angular/core';
import { NavController, Loading, AlertController, ActionSheetController, Platform, LoadingController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DataserviceProvider } from '../../providers/dataservice/dataservice';
import { HTTP } from '@ionic-native/http';
import { Transfer } from '../../../node_modules/@ionic-native/transfer';
import { DocumentViewer } from '../../../node_modules/@ionic-native/document-viewer';
import { File } from '../../../node_modules/@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private data : any = []
  private header:any={};
  options : BarcodeScannerOptions;
  encodetext : string = '';
  encodeData : any = {};
  scannedData : any = {};
  loading: Loading;
  

  constructor(public navCtrl: NavController, private alertCtrl : AlertController, private bottomSheet : ActionSheetController,
              private dataservice : DataserviceProvider, public http : HTTP, public scanner : BarcodeScanner,
              private file : File, private transfer : Transfer, private platform : Platform,
              private document : DocumentViewer, public zone : NgZone, public loadingCtrl: LoadingController,) {


  }

  showAlert(alertTitle : string, messageAlert : string){
    const alert = this.alertCtrl.create({
      title: alertTitle,
      message: messageAlert,
      buttons: ['OKE']
    });
    alert.present();  
  }

  presentActionSheet() {
    let actionSheet = this.bottomSheet.create({
      title: 'Pilih metode',
      buttons: [
        {
          text: 'Scan QRCode',
          handler: () => {
            this.scan();
          }
        },
        {
          text: 'Input manual',
          handler: () => {
            this.presentPrompt();
            //this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  scan(){
    this.options = {
      prompt : "Scan QRCode"
    };
    this.scanner.scan().then((data) => {
    this.scannedData = data;
    if(this.scannedData.text != '' ){
      this.checkDataInDB('checker.php', this.scannedData.text);
      this.scannedData = '';
    }
    this.scannedData.text = '';
    }, (err) => {
      this.scannedData = '';
      console.log("Error saat menscan qrcode : "+err);
    })
  }

  encode(){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodetext).then((data) => {
    this.encodeData = data;
    }, (err) => {
      console.log("Error saat menscan qrcode : " +err);
    })
  }

  intentReview(){
    this.navCtrl.push("ListperangkatPage", {isFiltering : false});
  }

  intentPart(){
    this.navCtrl.push("PartPage");
  }

  checkDataInDB(destination, scannedText){
    this.http.post(this.dataservice.mHost+destination, {id :scannedText}, this.header)
    .then(( res => {
      try{
        this.data = JSON.parse(res.data);
        if(this.data.message !== "0"){
          this.navCtrl.push('UpdatePage',{scanned : scannedText.toLowerCase(), isUpdate : true});
        }else{
          this.showAlert('Wait...', 'Tidak ada perangkat dengan QRCode yang anda scan, anda perlu menginput datanya terlebih dahulu.');
          this.navCtrl.push('InsertPage',{scanned : scannedText.toLowerCase(),isUpdate : false}); 
        }
      }catch(e){
        this.showAlert('Error Eksepsi', 'Tidak ada data id ini di pemeriksaan');
      }
    }));
  }

  add(){
    this.navCtrl.push('InsertPage',{scanned : '', isUpdate : false}); 
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'QRCode',
      message: 'Inputkan QRCode secara manual',
      inputs: [
        {
          name: 'qrCode',
          placeholder: 'ID QRCode'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OKE',
          handler: data => {
            if (data.qrCode != '') {
              this.checkDataInDB('checker.php', data.qrCode.toLowerCase());
              return true;
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  generateReport(){
    this.loading = this.loadingCtrl.create({
      content: 'Mengambil laporan...',
    });
    this.loading.present();
    let path = null;
    if(this.platform.is('ios')){
      path = this.file.externalRootDirectory; //not tested
      //path = this.file.documentsDirectory; //also not tested
      
    }else{
      //path = this.file.documentsDirectory; tested and not work
      path = this.file.externalRootDirectory; //tested and work
    }

    var data : any = [];
    this.http.get(this.dataservice.mHost+'datarender.php', {}, this.header)
    .then(res => {
        this.zone.run(() => {
        data = JSON.parse(res.data);
        const tr = this.transfer.create();
        tr.download(this.dataservice.uploads+'/report/'+data.message+'.xlsx', path+data.message+'.xlsx')
        .then(entry => {
          let url = entry.toUrl();
          console.log("Saved");
        });
        this.loading.dismissAll();
        this.showAlert('Disimpan', 'Laporan disimpan di ponsel anda');
        });
    }).catch(e => {
        console.log(e);
    });
    return data;
  }
}
