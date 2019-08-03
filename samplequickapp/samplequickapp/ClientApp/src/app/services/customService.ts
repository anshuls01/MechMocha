import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class CustomService {
  constructor(@Inject('BASE_URL') private baseUrl: string, private httpclient: HttpClient) {



  }

  JoinChat(userid: string, currentuserid: string, ChatId: string, GameId:string): Observable<string> {
    return this.httpclient.get<string>(this.baseUrl + 'api/account/joinchat?userid=' + userid + '&currentuserid=' + currentuserid + '&ChatId=' + ChatId + '&=GameId' + GameId)
      .do(data => console.log(`Join chat log: ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }
  leaveChat(userid: string, currentuserid: string, ChatId: string, GameId: string): Observable<string> {
    return this.httpclient.get<string>(this.baseUrl + 'api/account/leavechat?userid=' + userid + '&currentuserid=' + currentuserid + '&ChatId=' + ChatId + '&=GameId' + GameId)
      .do(data => console.log(`Join chat log: ${JSON.stringify(data)}`))
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err);
    return Observable.throw(err.message);
  }

}
