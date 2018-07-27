//import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { HTTP } from '@ionic-native/http';
/*
  Generated class for the DataserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataserviceProvider {

  header : any ={};
  public mHost= 'http://192.168.2.106/re/api/';
  public uploads = 'http://192.168.2.106/re';
  constructor(/*public http: HttpClient,*/ private mHttp : HTTP, private zone : NgZone) {
    console.log('Hello DataserviceProvider Provider');
  }

}
