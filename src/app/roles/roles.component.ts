import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleUserInfo } from '../models/user-role-info';
import { UserRoleService } from '../services/user-role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  public roleUserList: RoleUserInfo[] = [];
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private service: UserRoleService) {

  }

  ngOnInit() {
    this.service.loadData();

    this.service.roleUserListObs.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(list => {
        this.roleUserList = list

        //sort by name
        this.roleUserList && this.roleUserList.sort((a, b) => a.name.localeCompare(b.name));
      }
    );
  }

  //note we call this on ngModelChange to detect each input right away
  //we can call this on blur instead if we want to let the user type everything first
  public updateRoleName(roleID: number, roleName: string) {
    this.service.updateRoleName(roleID, roleName);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
