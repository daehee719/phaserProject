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