import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Pharmacy Management System - Users');
    //this.logger.log('Users loaded');
  }
}
