import { Position } from "../Network/Protocol";
import FS from 'fs';

export default class ServerMapManager
{
    static Instance: ServerMapManager;

    spawnPoints: Position[] = [];

    constructor(mapPath:string)
    {
        if(FS.existsSync(mapPath)) {
            let mapJson = FS.readFileSync(mapPath);
            let json = JSON.parse(mapJson.toString());
            
            for(let i = 0; i < json.layers[3].objects.length; i++){
                let obj = json.layers[3].objects[i];
                this.spawnPoints.push({x:obj.x, y:obj.y});
            }
        }else {
            console.error("맵파일이 존재하지 않습니다.");
        }
    }

    getRandomSpawnPosition(): Position
    {
        let posIndex:number = Math.floor( Math.random() * this.spawnPoints.length);
        return this.spawnPoints[posIndex];
    }
}