import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc'; // Add
import { isUndefined } from 'util';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  ngOnInit(): void {
    this.winMessage = '';
    }
  title = 'AgoraDemo';
  public winner: string = '';
  public Joined: boolean = false;
  channelId: string = '1234';
  public gameText: string = '';
  localStream: Stream // Add
  remoteCalls: any = [];
  public userscoreArray: number = 0;
  public currentuserscoreArray: number = 0;
  public gameName: string = '';
  public username: string = '';
  public currentusername: string = this.accountservice.currentUser.userName;
  public userScore: number = 0;
  public currentUserScore: number = 0;
  public winMessage: string= '';
  public gameRule = {
    correct: 10,
    max: 100,
    wrong: 0
  }

  // Add
  constructor(
    private agoraService: AngularAgoraRtcService, private accountservice: AccountService
  ) {
    this.agoraService.createClient();
  }

  // Add
  startCall() {
    if (this.channelId !== '') {
      this.agoraService.client.join(null, this.channelId, null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
        this.Joined = true;
        this.setGameRule();
      });
      this.Joined = false;
    }
    else {
      alert("Channel not specified, chat can't start");
      this.Joined = false;
    }
  }

  // Add
  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    // Add
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
      this.Joined = false;
    });

    // Add
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    // Add
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
      this.Joined = false;
    });

    // Add
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
      this.Joined = false;
    });

  }
  onJoinEvent(isSucess: string) {
    var arr = isSucess.split('$');
    this.username = arr[1];
    if (+arr[0] > 0) {
      this.channelId = arr[0].toString();
      this.startCall();
    }
  }

  addScore(userName: string) {
    if (userName == this.username)
      this.userscoreArray += 10;
    else
      this.currentuserscoreArray += 10;

    if (this.userscoreArray == 100 || this.currentuserscoreArray == 100) {
      if (this.userscoreArray == 100) {
        this.winMessage = this.username + ' Wins!';
        this.winner = this.username;
      }
      else { 
        this.winMessage = this.currentusername + ' Wins!';
        this.winner = this.currentusername;
      }



      // Add
      this.agoraService.client.on('stream-removed', (evt) => {
        const stream = evt.stream;
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
        console.log(`Remote stream is removed ${stream.getId()}`);
        this.Joined = false;
      });

      // Add
      this.agoraService.client.on('peer-leave', (evt) => {
        const stream = evt.stream;
        if (stream) {
          stream.stop();
          this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
          console.log(`${evt.uid} left from this channel`);
        }
        this.Joined = false;
      });

      this.Joined == false;
    }
  }
  setGameRule() {
    if ((+this.channelId) % 2 == 0) {
      this.gameRule.correct = 10;
      this.gameRule.wrong = 0;
      this.gameRule.max = 100;
      this.gameName = "Antakshari";
      this.gameText = "Sure Every body knows the rule, user will win first got 100 points, 10 Points for each right song."
    }
    else {
      this.gameRule.correct = 10;
      this.gameRule.wrong = 0;
      this.gameRule.max = 100;
      this.gameName = "Rock paper scissors";
      this.gameText = "Interesting Game, user will win first got 100 points, 10 Points for each right song."
    }
  }
}
