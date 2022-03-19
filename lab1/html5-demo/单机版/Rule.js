var board=new Array();
for (var i=0;i<=6;i++)
{
	board[i]=new Array();
	for (var j=0;j<=6;j++)
		board[i][j]=new Array();
}

var dir=[[0,0,1],[0,1,0],[0,1,1],[0,1,-1],[1,0,0],[1,0,1],[1,0,-1],[1,1,0],[1,-1,0],[1,1,1],[1,1,-1],[1,-1,1],[-1,1,1]];

function boardInit() {	
	for (var i=0;i<=6;i++)
		for (var j=0;j<=6;j++)
			for (var k=0;k<=6;k++)
				board[i][j][k]=0;
}

function checkWin(x,y,z) {
	var down,up,nx,ny,nz;
	for (var d=0;d<13;d++)
	{
		up=0;
		nx=x;
		ny=y;
		nz=z;
		while (nx>=0&&ny>=0&&nz>=0&&nx<=6&&ny<=6&&nz<=6&&board[x][y][z]==board[nx][ny][nz])
		{
			nx+=dir[d][0];
			ny+=dir[d][1];
			nz+=dir[d][2];
			up++;
		}
		down=0;
		nx=x;
		ny=y;
		nz=z;
		while (nx>=0&&ny>=0&&nz>=0&&nx<=6&&ny<=6&&nz<=6&&board[x][y][z]==board[nx][ny][nz])
		{
			nx-=dir[d][0];
			ny-=dir[d][1];
			nz-=dir[d][2];
			down++;
		}
		if (down+up>5)
			return 1;
	}
	return 0;
}