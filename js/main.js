const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let agrgun = document.getElementById("agrgun");
let enemyspeed = 3 //global speed for enemies

class Enemy { //protivník
	x = -100;
	y = Math.floor(Math.random()*(canvas.height - 100))+50;

	set() { //obnovení na začátek
		this.y = Math.floor(Math.random()*(canvas.height - 100))+50;
		this.x = -100;
	}

	move() { //pohyb doprava
		this.x += enemyspeed;
	}

	paint() { //nakreslení do canvasu
		ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,50,50);
	}
}

let player = { //hráč
    x: 1200,
    y: 300,
	speed: 5,
	velY: 0,
	friction: 0.9,
	keys: [],
	shot: 0,

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

        if (this.y > canvas.height - 90) {
            this.y = canvas.height - 90;
            this.velY = -this.velY;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velY = -this.velY;
        }

		ctx.fillStyle = "lightgrey";
		ctx.fillRect(0,this.y+60,this.x+5,4);

		if (this.keys['Space']) {
			game.enemies.forEach(function(obj, index) {
				if(player.y+62 > obj.y && player.y+62 < (obj.y+50) && player.x > obj.x && player.shot == 0) {
					ctx.fillStyle = "orange";
					ctx.fillRect(0,this.y+5,this.x,40);
					player.shot = 1;
					obj.set();
				}
			});

        }

        ctx.fillStyle = "green";

		ctx.drawImage(agrgun, this.x, this.y);

    }
}

let game = {

	enemies: [],

	addEnemy: function() {
        game.enemies.push(new Enemy());
    },


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
        ctx.fillRect(1300,0,1500,600);

		this.enemies.forEach(function(obj, index) {
            obj.move();
            obj.paint();
        });

		player.paint();

		this.enemies.forEach(function(obj, index) {
            if(obj.x > 1350) {
				game.lives--;
				if(game.lives == 0) {
					clearInterval(timer);
					alert("reee");
				} else {
					obj.set();
				}
			}
        });



    },
}

let shotproblem = { //hnusná záplata proti střílení když držíte mezerník, která funguje jenom z poloviny
	keys: [],
	unshot: function() {
		if (this.keys['Space']) {
			player.shot = 0;
		}
	}
}

document.body.addEventListener('keydown', function(event) { //pro ovládání (stisk)
    player.keys[event.code] = true;
	shotproblem.keys[event.code] = false;
});

document.body.addEventListener("keyup", function(event) { //pro ovládání (puštění)
    player.keys[event.code] = false;
	shotproblem.keys[event.code] = true;
	shotproblem.unshot();
});

game.play(); //Start hry

game.addEnemy();
setTimeout(function() { game.addEnemy(); }, 5000);
