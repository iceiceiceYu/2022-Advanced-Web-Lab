var togox,togoy,togoz;
var score=[0,16,256,15000,120000,120000,120000];
var dire=[[0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]];

var checked=new Array();
for (var i=0;i<=6;i++)
{
    checked[i]=new Array();
    for (var j=0;j<=6;j++)
    {
        checked[i][j]=new Array();
        for (var k=0;k<=6;k++)
            checked[i][j][k]=new Array();
    }
}

function checkInit() {
    for (var i=0;i<=6;i++)
        for (var j=0;j<=6;j++)
            for (var k=0;k<=6;k++)
                for (var d=0;d<13;d++)
                    checked[i][j][k][d]=0;
}

var tochoose=new Array();
for (var i=0;i<=6;i++)
{
    tochoose[i]=new Array();
    for (var j=0;j<=6;j++)
        tochoose[i][j]=new Array();
}
 
function chooseInit() {
    for (var i=0;i<=6;i++)
        for (var j=0;j<=6;j++)
            for (var k=0;k<=6;k++)
                tochoose[i][j][k]=0;
}

function settochoose(x,y,z,s) {
    var p={x:x,y:y,z:z};
    var q=new Array(),head=0;
    tochoose[x][y][z]=s;
    q.push(p);
    while (head<q.length)
    {
        p=q[head];
        for (var i=0;i!=6;i++)
        {
            var np={x:0,y:0,z:0};
            np.x=p.x+dire[i][0];
            np.y=p.y+dire[i][1];
            np.z=p.z+dire[i][2];
			if (np.x<0||np.x>6) continue;
			if (np.y<0||np.y>6) continue;
			if (np.z<0||np.z>6) continue;
            if (tochoose[p.x][p.y][p.z]>tochoose[np.x][np.y][np.z]+1)
            {
                tochoose[np.x][np.y][np.z]=tochoose[p.x][p.y][p.z]-1;
                q.push(np);
            }
        }
        head++;
    }
}

function evaluate() {
    var x,y,z,nx,ny,nz,up,down,divide,val=0;
    checkInit();
    for (var x=0;x<=6;x++)
        for (var y=0;y<=6;y++)
            for (var z=0;z<=6;z++)
                if (board[x][y][z])
                    for (d=0;d<13;d++)
                        if (!checked[x][y][z][d])
                        {
                            divide=1;
                            nx=x;
                            ny=y;
                            nz=z;
                            up=-1;
                            while (nx>=0&&ny>=0&&nz>=0&&nx<=6&&ny<=6&&nz<=6&&board[x][y][z]==board[nx][ny][nz])
                            {
                                checked[nx][ny][nz][d]=1;
                                nx+=dir[d][0];
                                ny+=dir[d][1];
                                nz+=dir[d][2];
                                up++;
                            }
                            if (nx<0||ny<0||nz<0||nx>6||ny>6||nz>6||board[x][y][z]==3-board[nx][ny][nz]) divide=2;
                            nx=x;
                            ny=y;
                            nz=z;
                            down=-1;
                            while (nx>=0&&ny>=0&&nz>=0&&nx<=6&&ny<=6&&nz<=6&&board[x][y][z]==board[nx][ny][nz])
                            {
                                checked[nx][ny][nz][d]=1;
                                nx-=dir[d][0];
                                ny-=dir[d][1];
                                nz-=dir[d][2];
                                down++;
                            }
                            if (nx<0||ny<0||nz<0||nx>6||ny>6||nz>6||board[x][y][z]==3-board[nx][ny][nz])
                            {
                                if (divide==1) divide=2;
                                else divide=256;
                            }
							if (up+down>3)
							{
								if (board[x][y][z]==2) val+=score[up+down];
								else val-=score[up+down];
							}
                            else {
								if (board[x][y][z]==2) val+=score[up+down]/divide;
								else val-=score[up+down]/divide;
							}
                        }
    return val+Math.random();
}

function alphabeta(depth,alpha,beta) {
    if (depth==0)
        return evaluate();
    for (var i=0;i<7;i++)
        for (var j=0;j<7;j++)
            for (var k=0;k<7;k++)
            {
                if ((!board[i][j][k])&&(tochoose[i][j][k]))
                {
                    board[i][j][k]=depth&1;
					if (!board[i][j][k]) board[i][j][k]=2;
                    var val=-alphabeta(depth-1,-beta,-alpha);
                    board[i][j][k]=0;
                    if (val>=beta)
                        return beta;
                    if (val>alpha)
                    {
                        alpha=val;
                        if (depth==2)
                        {
                            togox=i;
                            togoy=j;
                            togoz=k;
                        }
                    }
                }
            }
    return alpha;
}