import MySQL from 'mysql2/promise';

const poolOption : MySQL.PoolOptions = 
{
    host:"gondr.asuscomm.com",
    user:'yy_20112',
    password : '1234',
    database:'yy_20112',
    connectionLimit:10,
}

export const ConPool : MySQL.Pool = MySQL.createPool(poolOption);