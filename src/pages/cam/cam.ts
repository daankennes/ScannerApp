import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html'
})
export class CamPage {

  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner) {}

  public scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
       console.log(barcodeData);
      }, (err) => {
          console.log(err);
    });
  }
}
