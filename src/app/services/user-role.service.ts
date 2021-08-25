import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { UserRoleInfo, UserInfo, RoleInfo, RoleUserInfo, BaseUserInfo } from '../models/user-role-info';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private isFirstLoad: boolean = true;

  private userList: UserInfo[] = [];
  private userRoleList: UserRoleInfo[] = [];
  private userRoleListSbj: BehaviorSubject<UserRoleInfo[]> = new BehaviorSubject<UserRoleInfo[]>([]);
  public userRoleListObs = this.userRoleListSbj.asObservable();
  
  private roleList: RoleInfo[] = [];
  private roleUserList: RoleUserInfo[] = [];
  private roleUserListSbj: BehaviorSubject<RoleUserInfo[]> = new BehaviorSubject<RoleUserInfo[]>([]);
  public roleUserListObs = this.roleUserListSbj.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Makes a _GET HTTP request to the json server
   * 
   * @param {string} route - The path of the endpoint to be requested
   */
   private get(route: string): Observable<any> {
    const url = 'https://custom.rotacloud.com/angular-challenge/' + route;
    const headers = new HttpHeaders({
        'Accept': 'application/json'
    });

    return this.http.get(url, {headers: headers});
  }

  private getAllRoles(): Observable<RoleInfo[]> {
    return this.get('roles.json');
  }

  private getAllUsers(): Observable<UserInfo[]> {
    return this.get('users.json');
  }

  private loadAllUsersAndRoles() {
    forkJoin(this.getAllRoles(), this.getAllUsers()).subscribe(result => {
      if ((result != null) && (result.length > 0)) {
        this.roleList = result[0];
        this.userList = result[1];
      }

      //map the values and publish updated values
      this.updateUsersAndRoles();
    });
  }

  private updateUsersAndRoles() {
    //sort both list by name
    this.roleList && this.roleList.sort((a, b) => a.name.localeCompare(b.name));
    this.userList && this.userList.sort((a, b) => a.name.localeCompare(b.name));

    //remap
    this.userRoleList = this.mapRolesToUsers(this.roleList, this.userList);
    this.roleUserList = this.mapUsersToRoles(this.userList, this.roleList);

    //publish updated values
    if (this.userRoleListSbj != null) this.userRoleListSbj.next(this.userRoleList);
    if (this.roleUserListSbj != null) this.roleUserListSbj.next(this.roleUserList);
  }

  private mapRolesToUsers(roles: RoleInfo[], users: UserInfo[]): UserRoleInfo[] {
    let userRoleList: UserRoleInfo[] = [];

    if (users != null) {
      //go through each user and check their roles
      users.forEach(user => {
        if (user != null) {
          //create a new UserRoleInfo object
          let newUserRoleInfo: UserRoleInfo = {
            id: user.id,
            name: user.name
          }
         
          //get the full RoleInfo for each user role id
          if ((roles != null) && (user.roles != null)) {
            let newRoleList: RoleInfo[] = [];

            user.roles.forEach(userRoleID => {
              let currentRoleInfo: RoleInfo = roles.find(role => role.id === userRoleID);
              if (currentRoleInfo != null) newRoleList.push(currentRoleInfo);
            });

            //sort the roles list per user
            newRoleList && newRoleList.sort((a, b) => a.name.localeCompare(b.name));

            //add roleList property to our UserRoleInfo object
            newUserRoleInfo.roleList = newRoleList;
          }
          
          userRoleList.push(newUserRoleInfo);
        }
      });
    }

    return userRoleList;
  }

  private mapUsersToRoles(users: UserInfo[], roles: RoleInfo[]): RoleUserInfo[] {
    let roleUserList: RoleUserInfo[] = [];

    if (roles != null) {
      //go through each role and look for users from the users list
      roles.forEach(role => {
        if (role != null) {
          //create a new RoleUserInfo object
          let newRoleUserInfo: RoleUserInfo = {
            id: role.id,
            name: role.name,
            colour: role.colour
          }
         
          //get the BaseUserInfo for each user that has this role
          if (users != null) {
            let newUserList: BaseUserInfo[] = [];

            users.forEach(user => {
              if ((user != null) && (user.roles != null)) {
                const isRoleInUser: boolean = user.roles.includes(role.id);
                if (isRoleInUser) newUserList.push({ id: user.id, name: user.name });
              }
            });

            //add userList property to our RoleUserInfo object
            newRoleUserInfo.userList = newUserList;
          }
          
          roleUserList.push(newRoleUserInfo);
        }
      });
    }

    return roleUserList;
  }

  public loadData() {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.loadAllUsersAndRoles();
    }
  }

  public updateUserName(userID: number, userName: string) {
    //update the user name in user list
    if ((this.userList != null) && (this.userList.length > 0)) {
      let currentUser = this.userList.find(user => user.id === userID);

      if (currentUser != null) {
        currentUser.name = userName;

        //update the maps and publish updated values
        this.updateUsersAndRoles();
      }
    }
  }

  public updateRoleName(roleID: number, roleName: string) {
    //update the role name in role list
    if ((this.roleList != null) && (this.roleList.length > 0)) {
      let currentRole = this.roleList.find(role => role.id === roleID);

      if (currentRole != null) {
        currentRole.name = roleName;

        //update the maps and publish updated values
        this.updateUsersAndRoles();
      }
    }
  }
  
}
