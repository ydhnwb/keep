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

  public mHost= 'http://yudhanewbie.000webhostapp.com/api/'; //change this
  public uploads = 'http://yudhanewbie.000webhostapp.com/'; //change thiis
  
  constructor(/*public http: HttpClient,*/ private mHttp : HTTP, private zone : NgZone) {
    console.log('Hello DataserviceProvider Provider');
  }

}
