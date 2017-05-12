import { Component,ViewChild } from '@angular/core';
import { NavController,NavParams,Content,ToastController,LoadingController } from 'ionic-angular';
import {Http,Response} from '@angular/http';
import * as io from "socket.io-client";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	socket:any
	chat_input:string
	chats = [];
  username:string
  chatlist:any
  server:string = 'http://119.23.211.57:3000'
  // server:string = 'http://127.0.0.1:3000'
  num:number = 0
  isscroll = false 

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,public params: NavParams,public http:Http,public toastCtrl: ToastController,public loadingCtrl: LoadingController) {

    //加载数据
    this.http.get(this.server + '/chatdata' + '?load=' + this.num)
    .subscribe((res:Response) => {
        this.chatlist = res.json().chatlist;
        this.chatlist[0].isshowtime = true;
        for(let i=1;i<this.chatlist.length;i++){
          this.chatlist[i].isshowtime = this.checkshowtime(this.chatlist[i],this.chatlist[i-1])
        }
        // console.log(this.chatlist)
        setTimeout(()=>{ 
          this.content.scrollToBottom(300);
        }, 300);
    });

    //socket接受数据
  	this.socket = io(this.server);
  	this.socket.on('chat message', (msg) => {
      // console.log(this.chatlist[this.chatlist.length-1])
      msg.isshowtime = this.checkshowtime(msg,this.chatlist[this.chatlist.length-1])
      this.chatlist.push(msg);
      setTimeout(()=>{ 
        this.content.scrollToBottom(300);
      }, 100);
   	});

    //用户名
    this.username = this.params.data
  }

  //socket传输数据
  send(msg){
    this.socket.emit('chat message', {
      name:this.username,
      content:msg,
    });
    this.chat_input = '';
  }

  //点击加载数据
  load_message(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.num++
    this.http.get(this.server + '/chatdata' + '?load=' + this.num)
    .subscribe((res:Response) => {
      if(res.json().lenght>1){
        console.log(res.json().chatlist);
        let temp;
        for(let i=0;i<res.json().lenght;i++){
          temp = res.json().chatlist[i]
          if(i<res.json().lenght-1){
            temp.isshowtime = this.checkshowtime(res.json().chatlist[i+1],res.json().chatlist[i])
          }else{
            temp.isshowtime = true
          }
          this.chatlist.unshift(temp)
        }
      }else{
        let toast = this.toastCtrl.create({
          message: 'no data',
          position: 'middle',
          duration: 1000
        });
        toast.present();
      }
      loading.dismiss();
    });
  }

  checkshowtime(thistime,pretime){
    if(thistime.create_time-pretime.create_time>60){
      return true
    }else{
      return false
    }
  }
}
