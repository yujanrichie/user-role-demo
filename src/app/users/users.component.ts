import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserRoleInfo } from '../models/user-role-info';
import { UserRoleService } from '../services/user-role.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public userRoleList: UserRoleInfo[] = [];
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private service: UserRoleService) {

  }

  ngOnInit() {
    this.service.loadData();

    this.service.userRoleListObs.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(list => {
        this.userRoleList = list;
  
        //sort by name
        this.userRoleList && this.userRoleList.sort((a, b) => a.name.localeCompare(b.name));
      }
    );
  }

  //note we call this on ngModelChange to detect each input right away
  //we can call this on blur instead if we want to let the user type everything first
  public updateUserName(userID: number, userName: string) {
    this.service.updateUserName(userID, userName);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
