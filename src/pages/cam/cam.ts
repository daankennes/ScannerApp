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
  public count: 0;

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

    var studfound = false;
    var countfound = false;

    this.storage.forEach( (value, key, index) => {
      if (key === "studentdata"){
        this.students = value;
        console.log("Got saved studentdata");
        studfound = true;
        //break;
      }

      if (key === "count"){
        this.count = value;
        countfound = true;
        console.log("count found");
      }
    }).then(() => {
        if (!studfound){
          this.studentService.load()
            .then(data => {
              this.students = data;
              this.storage.set("studentdata", data);
              console.log("Saved studentdata");
          });
        }
        if (!countfound){
          this.storage.set("count", 0);
          this.count = 0;
          console.log("count set");
        }
      }, (err) => {
          console.log(err);
    });

  }

  showNameAlert() {

    let alert = this.alertCtrl.create({
      title: 'Persoon toevoegen',
      subTitle: 'Geef de voor -en achternaam op.',
      inputs: [
      {
        name: 'voornaam',
        placeholder: 'Voornaam'
      },
      {
        name: 'achternaam',
        placeholder: 'Achternaam',
      }
    ],
    buttons: [
      {
        text: 'Annuleren',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Toevoegen',
        handler: data => {
          if (data.voornaam != "" && data.achternaam != "") {
            this.addStudentWithoutCard(data.voornaam, data.achternaam);
          } else {
            this.presentAddedPerson("Ongeldige voor -en/of achternaam");
          }
        }
      }
    ]
    });
    alert.present();

  }

  addStudentWithoutCard(voornaam, naam){
    this.storage.set(this.count.toString(), ["registeredstudent", voornaam, naam]);
    this.presentAddedPerson(voornaam + " " + naam + " is toegevoegd aan lijst!");
    this.count++;
    this.storage.set("count", this.count);
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
   if (!found && barcodeData.cancelled != true){
     this.presentAddedPerson("Student niet gevonden.");
     console.log(barcodeData);
   }
  }

  public scan(){
    this.barcodeScanner.scan(
      {
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          disableSuccessBeep: false // iOS and Android
      }
    ).then((barcodeData) => {
       this.checkStudentID(barcodeData);
      }, (err) => {
          console.log(err)
    });
  }


}
