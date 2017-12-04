import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StudentService } from '../../providers/student-service/student-service';

@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html',
  providers: [StudentService]
})
export class CamPage {

  public students: any;

  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController, private storage: Storage, public studentService: StudentService) {
      this.downloadStudentData();
      //this.scan(); //camera direct openen bij starten applicatie
  }

  presentAddedPerson(text) : void {
    let alert = this.alertCtrl.create({
      title: 'Registratie student',
      subTitle: text,
      buttons: ['Sluiten']
    });
    alert.present();
  }

  downloadStudentData() : void {
   this.studentService.load()
     .then(data => {
       this.students = data;
   });
  }

  checkStudentID(barcodeData) : void {
    console.log(this.students.rows[0].doc.snr.length);

    var formattedbarcodeData = barcodeData.text.substring(4, 11) + "-" + barcodeData.text.substring(11, barcodeData.text.length);
    console.log(formattedbarcodeData);
    var found = false;

    for (var i = 0; i < this.students.rows[0].doc.snr.length; i++) {
      if (this.students.rows[0].doc.snr[i].regnr == formattedbarcodeData){
        found = true;
        console.log("gevonden");
        this.presentAddedPerson(this.students.rows[0].doc.snr[i].Voornaam + " " + this.students.rows[0].doc.snr[i].Naam + " wordt toegevoegd aan de lijst.");

        if (this.storage.get('students')){
          //var tempdata = "";
          var tempdata = this.storage.get('students');
          //tempdata.push(this.students.rows[0].doc.snr[i]);
          this.storage.set('students', tempdata);
        }
        else {
          var arr = [this.students.rows[0].doc.snr[i]];
          this.storage.set('students', arr);
        }

      }
   }
   if (!found){
     this.presentAddedPerson("Student niet gevonden.");
   }
  }

  public scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
       console.log(barcodeData);
       this.checkStudentID(barcodeData);
       //this.storage.set('snumber', barcodeData.text); //voor nu laatst gescande value storen
      }, (err) => {
          console.log(err)
    });
  }


}
