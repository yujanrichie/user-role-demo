export interface UserRoleInfo extends BaseUserInfo
{
    roleList?: RoleInfo[];
}

export interface UserInfo extends BaseUserInfo
{
    roles?: number[];
}

export interface BaseUserInfo
{
    id: number;
    name: string;
}

export interface RoleUserInfo extends RoleInfo
{
    userList?: BaseUserInfo[];
}

export interface RoleInfo
{
    id: number;
    name: string;
    colour: string;
}