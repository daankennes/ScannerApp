import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html'
})
export class CamPage {

  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {}

  public presentAlert(barcodeData) {
  let alert = this.alertCtrl.create({
    title: 'Persoon toegevoegd!',
    subTitle: 'x wordt toegevoegd aan de lijst.',
    buttons: ['Sluiten']
  });
  alert.present();
}
  public scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
       console.log(barcodeData);
       presentAlert(barcodeData);
      }, (err) => {
          console.log(err)
    });
  }
}
