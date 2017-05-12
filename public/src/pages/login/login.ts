import { Component } from '@angular/core';
import { NavController,NavParams,ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
	user_input : string

  constructor(public navCtrl: NavController,public params: NavParams,public toastCtrl: ToastController) {
  	
  }

  login(username){
  	if(username!=""&&username!=undefined){
  		this.navCtrl.push(TabsPage,{username:username});
  	}else{
  		let toast = this.toastCtrl.create({
	      message: 'Please enter username',
	      position: 'middle',
	      duration: 2000
	    });
	    toast.present();
  	}
  }
}
