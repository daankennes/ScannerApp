import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public students : Array<any>;
  public str : string;

  constructor(public navCtrl: NavController, private storage: Storage) {
    this.students = [];
  }

  ionViewDidEnter() {
    this.listStudents();
  }

  deleteData() {
    this.storage.clear();
    this.students = [];
    console.log("Data cleared");
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
