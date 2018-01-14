import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public students : Array<any>;
  public str : string;
  pdfObj = null;
  public loading: any;

  constructor(public navCtrl: NavController, private storage: Storage, public events: Events, private alertCtrl: AlertController, private plt: Platform, private file: File, private fileOpener: FileOpener, private socialSharing: SocialSharing, public loadingCtrl: LoadingController) {
    this.students = [];
  }

  ionViewDidEnter() {
    this.listStudents();
  }

  createPdf() {
    this.startLoading();
    let studarray = JSON.parse(JSON.stringify(this.students));
    studarray.sort();
    let docDefinition = {
      content: [
        { text: 'Lijst geregistreerde studenten', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        {
          ul: studarray
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.sendPdf();
  }

  sendPdf() {

    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'lijst.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDF
          //this.fileOpener.open(this.file.dataDirectory + 'lijst.pdf', 'application/pdf');
          // Send the PDF
          let path = this.file.dataDirectory + 'lijst.pdf';

          var options = {
            message: 'Lijst met studenten in bijlage.', // not supported on some apps (Facebook, Instagram)
            subject: 'AP StudScan geregistreerde studenten', // fi. for email
            files: [path], // an array of filenames either locally or remotely
            chooserTitle: 'Kies een app'
          }
          this.stopLoading();
          this.socialSharing.shareWithOptions(options);
        })
      });
    } else {
      // On a browser simply use download!
      this.stopLoading();
      this.pdfObj.download();
    }
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

  startLoading(){

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Even geduld...'
    });

    this.loading.present();
  }

  stopLoading(){
    if (this.loading != null){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  listStudents() {

    console.log("Checked for new students");

    this.students = [];

    this.storage.forEach( (value, key, index) => {

      //console.log(key);
      //console.log(value);

      if (value[0] == "registeredstudent"){ //check if key value pair in storage is a scanned student

        /*if (this.students.filter(s => s.Voornaam == value[1] && s.Naam == value[2]).length < 1) { //if students array does not yet contain the student, push the json object
          //var jsonobj = {"Voornaam": value[1], "Naam": value[2]};
          console.log("Student added to array");
        }*/
        this.students.push(value[1] + " " + value[2]);

      }
    })
  }


}
