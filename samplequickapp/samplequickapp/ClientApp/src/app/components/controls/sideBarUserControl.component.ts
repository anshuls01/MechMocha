import { AccountService } from './../../services/account.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountEndpoint } from 'src/app/services/account-endpoint.service';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { Utilities } from 'src/app/services/utilities';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
  selector: 'app-sideuser',
  templateUrl: './sideBarUserControl.component.html',
  styleUrls: ['./sideBarUserControl.component.css']
})

export class SideBarUserComponent implements OnInit {
  columns: any[] = [];
  title = 'Player(s)';
  loadingIndicator: boolean;
  rowsCache: User[] = [];
  rows: User[] = [];
  allRoles: Role[] = [];

  @ViewChild('indexTemplate')
  indexTemplate: TemplateRef<any>;

  @ViewChild('userNameTemplate')
  userNameTemplate: TemplateRef<any>;

  @ViewChild('rolesTemplate')
  rolesTemplate: TemplateRef<any>;


  ngOnInit(): void {
    const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: 'index', name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
      { prop: 'jobTitle', name: gT('users.management.Title'), width: 50 },
      { prop: 'userName', name: gT('users.management.UserName'), width: 90, cellTemplate: this.userNameTemplate },
      { prop: 'fullName', name: gT('users.management.FullName'), width: 120 },
      { prop: 'email', name: gT('users.management.Email'), width: 140 },
      { prop: 'roles', name: gT('users.management.Roles'), width: 120, cellTemplate: this.rolesTemplate },
      { prop: 'phoneNumber', name: gT('users.management.PhoneNumber'), width: 100 }
    ];

    //if (this.canManageUsers) {
    //  this.columns.push({ name: '', width: 160, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });
    //}

    this.loadData();
  

    // this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
  }

  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.accountService.getMatchedUsers().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }

  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  onDataLoadSuccessful(users: User[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    users.forEach((user, index, users) => {
      (<any>user).index = index + 1;
    });

    this.rowsCache = [...users];
    this.rows = users;

  }


  constructor(private accountService: AccountService, private alertService: AlertService, private translationService: AppTranslationService) {

  }

}
