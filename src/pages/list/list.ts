import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public students : Array<any>;
  public str : string;

  constructor(public navCtrl: NavController, private storage: Storage, public events: Events, private alertCtrl: AlertController) {
    this.students = [];
  }

  ionViewDidEnter() {
    this.listStudents();
  }

  deleteData() {

    let alert = this.alertCtrl.create({
      title: 'Data verwijderen',
      subTitle: 'Selecteer de te verwijderen data.',
      inputs: [
         {
           name: 'storage',
           label: 'Gehele storage',
           type: "checkbox",
           value: "storage",
           checked: false
         },
         {
           name: 'studenten',
           label: 'Studenten in storage',
           type: 'checkbox',
           value: 'students',
           checked: false
         },
         {
           name: 'provider',
           label: 'Studenten in service provider',
           type: 'checkbox',
           value: 'provider',
           checked: false
         }
      ],
      buttons: [
      {
        text: 'Annuleren',
        handler: () => {
          console.log('nothing removed');
        }
      },
      {
        text: 'Verwijder selectie',
        handler: (data) => {
          if (data.indexOf("storage") != -1){
            this.storage.clear();
            this.students = [];
            console.log("storage cleared");
          }
          if (data.indexOf("students") != -1){
            this.storage.forEach( (value, key, index) => {
              if (value[0] == "registeredstudent"){ //check if key value pair in storage is a scanned student
                this.storage.remove(key);
              }
            })
            this.students = [];
            console.log("students removed from storage");
          }
          if (data.indexOf("provider") != -1){
            this.events.publish('datacleared');
            console.log("provider data removal event published");
          }
        }
      }
    ]
    });
    alert.present();



  }

  listStudents() {

    console.log("Checked for new students");

    this.storage.forEach( (value, key, index) => {

      //console.log(key);
      //console.log(value);

      if (value[0] == "registeredstudent"){ //check if key value pair in storage is a scanned student

        if (this.students.filter(s => s.Voornaam == value[1] && s.Naam == value[2]).length < 1) { //if students array does not yet contain the student, push the json object
          var jsonobj = {"Voornaam": value[1], "Naam": value[2]};
          this.students.push(jsonobj);
          console.log("Student added to array");
        }

      }
    })
  }


}
