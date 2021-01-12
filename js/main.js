const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let enemyspeed = 3
  
let enemy = {
    x: 0,
    y: 0,
	
	set: function() {
        this.y = Math.floor(Math.random() * (canvas.height - 50));
		this.x = 0;
    },
    /* shake() - simulace roztřesení ruky - náhodný pohyb kříže */
    move: function() {
        this.x += enemyspeed;
    },
    /* paint() - vykreslení kříže na plátno */
    paint: function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,50,50);
    }
}

let player = {
    x: 1000,
    y: 300,
	speed: 4,
	velY: 0,
	friction: 0.9,
	keys: [],
	shot: 0,

    /* paint() - vykreslení kříže na plátno */
    paint: function() {
		
		if (this.keys['ArrowUp']) {
            if (this.velY > -this.speed) {
                this.velY--;
            }
        }
        
        if (this.keys['ArrowDown']) {
            if (this.velY < this.speed) {
                this.velY++;
            }
        }
		
		this.velY *= this.friction;
        this.y += this.velY;

        if (this.y > canvas.height - 50) {
            this.y = canvas.height - 50;
            this.velY = -this.velY;
        } 
        
        if (this.y < 0) {
            this.y = 0;
            this.velY = -this.velY;
        }
		ctx.fillStyle = "lightgrey";
		ctx.fillRect(0,this.y+5,this.x,40);
		
		if (this.keys['Space']) {
            if(player.y+25 > enemy.y && player.y+25 < (enemy.y+50) && player.x > enemy.x && player.shot == 0) {
				ctx.fillStyle = "orange";
				ctx.fillRect(0,this.y+5,this.x,40);
				player.shot = 1;
				enemy.set();
			}
        }
		
        ctx.fillStyle = "green";
        ctx.fillRect(this.x,this.y,50,50);
		
    }
}

let game = {
	
	
	
	lives: 2,
	
    play: function() {
        timer = setInterval(function() {
            game.repaint();
			enemyspeed += 0.001;
        }, 20);
    },
    /* repaint() - překreslení celého plátna */
    repaint: function() {
		
		
        // Vyčištění plátna
        ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "blue";
        ctx.fillRect(1200,0,1500,600);
        // "Roztřesení" (náhodný přesun) záměrného kříže
        enemy.move();
        // Vykreslení kříže
		player.paint();
        enemy.paint();
		
		
		if(enemy.x > 1200) {
			this.lives--;
			if(this.lives == 0) {
				clearInterval(timer);
				alert("reee");
			} else {
				enemy.set();
			}
		}
    },
}

let shotproblem = {
	keys: [],
	unshot: function() {
		if (this.keys['Space']) {
			player.shot = 0;
		}
	}
}

document.body.addEventListener('keydown', function(event) { 
    player.keys[event.code] = true;
	shotproblem.keys[event.code] = false;
});
document.body.addEventListener("keyup", function(event) {
    player.keys[event.code] = false;
	shotproblem.keys[event.code] = true;
	shotproblem.unshot();
});
game.play();
