import { SessionTeam } from "../Server/Session";

export interface Position 
{
    x:number;
    y:number;
}

export interface SessionInfo 
{
    id:string;
    name:string;
    position:Position;
    //좌우뒤집힘 여부
    flipX:boolean;
    //이동하고 있는지 여부
    isMoveing:boolean;
}
export interface PlayerList 
{
    list:SessionInfo[];
}
export interface iceball
{
    ownerId:string;
    projectileId:number;
    position:Position;
    direction:number;
    velocity:number;
    lifeTime:number;
    damage: number;
}

export interface HitInfo
{
    projectileId:number;// 피격당한 투사체의 id
    playerId:string; 
    projectileLTPosition: Position;
    damage: number;
}

export interface DeadInfo
{
    playerId:string;
}

export interface ReviveInfo
{
    playerId:string;
    info:SessionInfo;
}

export interface UserInfo
{
    name:string;
    playerId:string;
    team?:SessionTeam;
    isReady?:boolean;
}
export interface CreateRoom
{
    name:string;
    playerId:string;
}
export interface EnterRoom
{
    roomNo:number;
}
export interface RoomInfo
{
    userList : UserInfo[];
    no:number;
    name:string;
    userCnt:number;
    maxCnt:number;
    isPlaying:boolean;
    ownerId : string;
}

export interface MsgBox
{
    msg:string;
}

export interface ChangeTeam
{
    plyaerID:string;
    team:SessionTeam;
}

export interface RoomReady{
    ready:boolean;
}