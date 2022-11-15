const mapWidth : number = 1680;
const gameWidth : number = 1280;
export const GameOption =
{
    width:1280,
    height:600,
    mapOffset: mapWidth>gameWidth ? mapWidth - gameWidth : 0,
    cameraZoomFactor : 1.5,
    bottomOffset:200,
}