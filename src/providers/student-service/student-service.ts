import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

/*
  Generated class for the StudentServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudentService {

  data: any;

  constructor(public http: HttpClient, private alertCtrl: AlertController, public events: Events) {
    console.log('Hello StudentServiceProvider Provider');
  }

  load() {
  if (this.data) {
    // already loaded data
    return Promise.resolve(this.data);
  }

  // don't have the data yet
  return new Promise(resolve => {
    // We're using Angular HTTP provider to request the data,
    // then on the response, it'll map the JSON data to a parsed JS object.
    // Next, we process the data and resolve the promise with the new data.
    this.http.get('https://dacques.cloudant.com/scannerapp/_all_docs?include_docs=true')
      //.map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.data = data;
        resolve(this.data);
      },
        err => {
          console.log('Something went wrong!');
          let alert = this.alertCtrl.create({
            title: 'Data onbereikbaar',
            subTitle: "Kan benodigde data niet downloaden. Internetverbinding beschikbaar?",
            buttons: [
            {
              text: 'Opnieuw proberen',
              handler: () => {
                this.events.publish('downloadfailed');
              }
            }
          ]
          });
          alert.present();
    });
  });
}


}
