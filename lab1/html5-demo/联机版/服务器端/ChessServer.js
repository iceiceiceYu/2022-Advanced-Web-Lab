var x,y,z,ctrl,step,s;

var board=new Array();
for (var i=0;i<=6;i++)
{
    board[i]=new Array();
    for (var j=0;j<=6;j++)
        board[i][j]=new Array();
}

var dir=[[0,0,1],[0,1,0],[0,1,1],[0,1,-1],[1,0,0],[1,0,1],[1,0,-1],[1,1,0],[1,-1,0],[1,1,1],[1,1,-1],[1,-1,1],[-1,1,1]];

function boardInit() {    
    steps=0;
    for (var i=0;i<=6;i++)
        for (var j=0;j<=6;j++)
            for (var k=0;k<=6;k++)
                board[i][j][k]=0;
}

function checkWin(x,y,z) {
    var down,up;
    steps++;
    for (var d=0;d<13;d++)
    {
        down=1;
        up=1;
        while (x+up*dir[d][0]>=0&&y+up*dir[d][1]>=0&&z+up*dir[d][2]>=0&&x+up*dir[d][0]<=6&&y+up*dir[d][1]<=6&&z+up*dir[d][2]<=6&&board[x][y][z]==board[x+up*dir[d][0]][y+up*dir[d][1]][z+up*dir[d][2]]) up++;
        while (x-down*dir[d][0]>=0&&y-down*dir[d][1]>=0&&z-down*dir[d][2]>=0&&x-down*dir[d][0]<=6&&y-down*dir[d][1]<=6&&z-down*dir[d][2]<=6&&board[x][y][z]==board[x-down*dir[d][0]][y-down*dir[d][1]][z-down*dir[d][2]]) down++;
        if (down+up>5)
            return 1;
    }
    return 0;
}

var webSocketsServerPort=8080;
var webSocketServer=require('websocket').server;
var http=require('http');

var clients=[];

var server=http.createServer(function(request,response){});
server.listen(webSocketsServerPort,function(){
    console.log((new Date())+"Server is listening on port "+webSocketsServerPort);
});

var wsServer=new webSocketServer({
    httpServer:server
});

function gamestart() {
    if (clients.length==1) 
    {
        console.log((new Date())+"There is only you . Keep waiting .");
        ctrl=3;
        clients[0].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
    } else {
        console.log((new Date())+"Game Start !");
        boardInit();
        ctrl=0;
        clients[0].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
        ctrl=1;
        clients[1].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
        ctrl=2;
        for (var i=2;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
    }
}

wsServer.on('request',function(request) {
    var client={
        connection:request.accept(null,request.origin),
        index:clients.length
    } 
    clients.push(client);
    if (clients.length<3) gamestart();
    else
    {
        console.log((new Date())+"A viewer gets in . There is "+clients.length+" people totally .");
        client.connection.sendUTF(JSON.stringify({type:'board',data:board}));
    }

    client.connection.on('message',function(message){
        if (message.type=='utf8') {
            var step={x:0,y:0,z:0,blackwhite:0};
            step.x=parseInt(message.utf8Data.substring(1,2));
            step.y=parseInt(message.utf8Data.substring(3,4));
            step.z=parseInt(message.utf8Data.substring(5,6));
            step.blackwhite=parseInt(message.utf8Data.substring(7,8));
            if (board[step.x][step.y][step.z]==0)
            {
                for (var i=0;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'step',data:step}));
                if (step.blackwhite)
                    {
                    board[step.x][step.y][step.z]=1;
                    console.log((new Date())+"White walks at ("+step.x+","+step.y+","+step.z+") .");
                    if (checkWin(step.x,step.y,step.z))
                    {
                        ctrl=7;
                        for (var i=0;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
                        console.log((new Date())+"White wins . Restart .");
                        gamestart();
                    }
                }
                else {
                    board[step.x][step.y][step.z]=2;
                    console.log((new Date())+"Black walks at ("+step.x+","+step.y+","+step.z+") .");
                    if (checkWin(step.x,step.y,step.z))
                    {
                        ctrl=8;
                        for (var i=0;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
                        console.log((new Date())+"Black wins . Restart .");
                        gamestart();
                    }
                }
                if (steps==343)
                {
                    ctrl=6;
                    for (var i=0;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'step',data:step}));
                    console.log((new Date())+"Draw . Restart .");
                    gamestart();
                }
            }
        }
    });

    client.connection.on('close',function(connection){
        var index=client.index;
        for (var i=index+1;i<clients.length;i++)
            clients[i].index--;
        clients.splice(index,1);
        if (index<2) {
            if (clients.length==0)
            {
                console.log((new Date())+"Empty now .");
            }
            else if (index==0)
            {
                console.log((new Date())+"Black gets out . There is "+clients.length+" people totally . Going to restart the game .");
                ctrl=4;
            } else {
                console.log((new Date())+"White gets out . There is "+clients.length+" people totally . Going to restart the game .");
                ctrl=5;
            }
            for (var i=0;i<clients.length;i++) clients[i].connection.sendUTF(JSON.stringify({type:'ctrl',data:ctrl}));
                gamestart();
        }
        else console.log((new Date())+"A viewer gets out . There is "+clients.length+" people totally .");
        
    });
});