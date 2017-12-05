import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StudentService } from '../../providers/student-service/student-service';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-cam',
  templateUrl: 'cam.html',
  providers: [StudentService]
})
export class CamPage {

  public students: any;

  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController, private storage: Storage, public studentService: StudentService, public events: Events) {
      events.subscribe('downloadfailed', () => {
       this.checkStudentData();
     });
    }

  presentAddedPerson(text) : void {
    let alert = this.alertCtrl.create({
      title: 'Registratie student',
      subTitle: text,
      buttons: ['Sluiten']
    });
    alert.present();
  }

  ionViewDidEnter() {
    this.checkStudentData();
  }

  checkStudentData() : void { //check if data exists in storage, if not, download and save data

    var found = false;

    this.storage.forEach( (value, key, index) => {
      if (key === "studentdata"){
        this.students = value;
        console.log("Got saved studentdata");
        found = true;
        //break;
      }
    }).then(() => {
        if (!found){
          this.studentService.load()
            .then(data => {
              this.students = data;
              this.storage.set("studentdata", data);
              console.log("Saved studentdata");
          });
        }
      }, (err) => {
          console.log(err);
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

        this.storage.set(this.students.rows[0].doc.snr[i].regnr, ["registeredstudent", this.students.rows[0].doc.snr[i].Voornaam, this.students.rows[0].doc.snr[i].Naam]);

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
