import MySQL, { RowDataPacket } from 'mysql2/promise';
// 오브젝트 풀링
// 미리 오브젝트를 생성해가지고 재활용
// 생성하는데 오버헤드가 심하니까
let poolOption : MySQL.PoolOptions = 
{
    host:"gondr.asuscomm.com",
    user:'yy_20112',
    password:'1234',
    database:'yy_20112',
    connectionLimit:10
};

export interface Score extends RowDataPacket
{
    id:number,
    username:string,
    level:number,
    time:Date
}

export const ConPool: MySQL.Pool = MySQL.createPool(poolOption);