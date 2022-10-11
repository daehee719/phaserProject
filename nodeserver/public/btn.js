const btn = document.querySelector("#btnRand");

btn.addEventListener("click",e=>
{
    let ratio = Math.random();
    if(ratio < 0.5)
    {
                alert("예! 동윤이는 잘거에요!");
            }
            else
            {
                alert("아니요! 그럴리가 없잖아요!");
            }
        })        