import { Person } from "./Person.js";




const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext('2d');
let playerX = 10;
let playerY = 10;
let playerSize = 30;
let speed = 150;//�ʴ� 200px
let playerColor = "#f00";

//�̹� ������� ��ü�� ���� ����
// ���� ��ü���� ����
let keyArr=[];
document.addEventListener("keydown",e=>
{
    keyArr[e.keyCode] = true;
})
document.addEventListener("keyup",e=>
{
    keyArr[e.keyCode] = false;
})
function Update()
{
    if(keyArr[37])
    {
        if(playerX==0)
            playerX = 0;
        else
            playerX -= speed/60;
    }
    if(keyArr[38])
    {
        if(playerY==0)
            playerY = 0;
        else
            playerY -= speed/60;
    }
    if(keyArr[39])
    {
        if(playerX == canvas.width - playerSize)
            playerX == canvas.width - playerSize;
        else
            playerX += speed/60;
    }
    if(keyArr[40])
    {
        if(playerY == canvas.height - playerSize)
            playerY == canvas.height - playerSize;
        else
            playerY += speed/60;
    }

    /*������ Player�� ������ ���Ϸ� ���� Ŭ����ȭ ��Ű�°� �Ұ���*/

    /*
    JSON
    ������Ÿ����
    Ŭ����
    TS */


    
}
function Render()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = playerColor
    ctx.fillRect(playerX,playerY,playerSize,playerSize);
}
let gameLoop = setInterval(()=>{
    Update();
    //����
    Render();

},1000/60)

function A()
{
    this.a = 10;
}
let c = new A();


class Person{
    constructor(name, age)
    {
        this.name =name;
        this.age = age;
    }

    introduce()
    {
        console.log(`hello I'm ${this.name} and my age is ${this.age}`);
    }
}
// function Person(name, age)
// {
//     this.name = name;
//     this.age = age;
    
// }
// Person.prototype.introduce = function()
// {
//     console.log(`hello I'm ${this.name} and my age is ${this.age}`);
// }

// let obj1 = new Person("daehee",18);

// let obj2 = new Person("test",00);

obj2.introduce = function()
{
    console.log("fix..");
}