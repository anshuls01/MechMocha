import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { BootstrapSelectDirective } from '../../directives/bootstrap-select.directive';
import { AccountService } from '../../services/account.service';
import { ThemeManager } from '../../services/theme-manager';
import { Utilities } from '../../services/utilities';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'game-Interest',
  templateUrl: './game-Interest.component.html',
  styleUrls: ['./game-Interest.component.scss']
})
export class GameInterestComponent implements OnInit{

  public language: string = '1';
  public city: string = '1';
  public gender: string = '1';

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    public themeManager: ThemeManager,
    public configurations: ConfigurationService) {
  }


    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
  }

  setAsDefault() {
    this.alertService.showDialog('Are you sure you want to set the current Game Interest?', DialogType.confirm,
      () => this.setAsDefaultHelper(),
      () => this.alertService.showMessage('Operation Cancelled!', '', MessageSeverity.default));
  }


  setAsDefaultHelper() {
    this.alertService.startLoadingMessage('', 'Saving new settings');

    this.accountService.updateUserInterest(this.accountService.currentUser.id, this.gender, this.city, this.language)
      .subscribe(response => {
        this.alertService.stopLoadingMessage();
        this.alertService.showMessage('New Interest', 'Game Interest updated successfully', MessageSeverity.success);

      },
        error => {
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Save Error', `An error occured whilst saving configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }



  //resetDefault() {
  //  this.alertService.showDialog('Are you sure you want to reset your defaults?', DialogType.confirm,
  //    () => this.resetDefaultHelper(),
  //    () => this.alertService.showMessage('Operation Cancelled!', '', MessageSeverity.default));
  //}
  //resetDefaultHelper() {
  //  this.alertService.startLoadingMessage('', 'Resetting defaults');

  //  this.accountService.updateUserPreferences(null)
  //    .subscribe(response => {
  //      this.alertService.stopLoadingMessage();
  //      this.configurations.import(null);
  //      this.alertService.showMessage('Defaults Reset', 'Account defaults reset completed successfully', MessageSeverity.success);

  //    },
  //      error => {
  //        this.alertService.stopLoadingMessage();
  //        this.alertService.showStickyMessage('Save Error', `An error occured whilst resetting configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
  //          MessageSeverity.error, error);
  //      });
  //}


}
