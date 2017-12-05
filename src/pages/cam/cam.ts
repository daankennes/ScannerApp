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
  public voornaam: string;
  public naam: string;
  public regnr: string;

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
    var alreadystored = false;

    //loop through all students to find match
    for (var i = 0; i < this.students.rows[0].doc.snr.length; i++) {
      //if match found
      if (this.students.rows[0].doc.snr[i].regnr == formattedbarcodeData){
        found = true;
        console.log("Student found");

        this.voornaam = this.students.rows[0].doc.snr[i].Voornaam;
        this.naam = this.students.rows[0].doc.snr[i].Naam;
        this.regnr = this.students.rows[0].doc.snr[i].regnr;

        //loop through all already stored students to check if student has already been stored
        this.storage.forEach( (value, key, index) => {
        	console.log("This is the value", value)
        	console.log("from the key", key)
        	console.log("Index is", index)

          if (value[1] == this.voornaam && value[2] == this.naam){
            alreadystored = true;
            console.log("Student already stored");
          }
        }).then(() => {
           //student wasn't stored and will be stored now
           if (found && !alreadystored){
             this.storage.set(this.regnr, ["registeredstudent", this.voornaam, this.naam]);
             this.presentAddedPerson(this.voornaam + " " + this.naam + " is toegevoegd aan lijst!");
           }
           //student was already stored
           else{
             this.presentAddedPerson(this.voornaam + " " + this.naam + " stond al in lijst.");
           }

          }, (err) => {
              console.log(err)
        });

      }
   }
   //no match found with all students
   if (!found){
     this.presentAddedPerson("Student niet gevonden.");
   }
  }

  public scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
       this.checkStudentID(barcodeData);
      }, (err) => {
          console.log(err)
    });
  }


}
