// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { ChatComponent } from '../chat/chat.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [fadeInOut]
})
export class HomeComponent implements OnInit {
  public userLogin: boolean = false;
  ngOnInit(): void {
    this.userLogin = this.authservice.isLoggedIn;
    }
  constructor(public configurations: ConfigurationService, private authservice: AuthService) {

    }
}
