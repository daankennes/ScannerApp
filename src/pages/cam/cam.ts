import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html'
})
export class CamPage {

  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner, private alertCtrl: AlertController, private storage: Storage) {

  }

  presentAddedPerson(barcodeData) : void {
    let alert = this.alertCtrl.create({
      title: 'Persoon toegevoegd!',
      subTitle: barcodeData.text + ' wordt toegevoegd aan de lijst.',
      buttons: ['Sluiten']
    });
    alert.present();
  }


  public scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
       console.log(barcodeData);
       this.storage.set('snumber', barcodeData.text); //voor nu laatst gescande value storen
       this.presentAddedPerson(barcodeData);
      }, (err) => {
          console.log(err)
    });
  }


}
