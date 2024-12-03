const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bullets;
let asteroids;
let score = 0;
let scoreText;
let gameOver = false;
let shootKey;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'https://cdn.pixabay.com/photo/2016/12/23/14/57/milky-way-1928414_960_720.jpg'); // Hình nền vũ trụ
    this.load.image('player', 'https://cdn.pixabay.com/photo/2020/04/23/19/24/space-5088768_960_720.png'); // Hình ảnh tàu vũ trụ
    this.load.image('bullet', 'https://cdn.pixabay.com/photo/2020/04/01/02/42/bullet-4996096_960_720.png'); // Hình ảnh đạn
    this.load.image('asteroid', 'https://cdn.pixabay.com/photo/2020/06/16/23/08/asteroid-5308542_960_720.png'); // Hình ảnh thiên thạch
}

function create() {
    this.add.image(400, 300, 'background');

    player = this.physics.add.sprite(400, 500, 'player');
    player.setCollideWorldBounds(true);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    asteroids = this.physics.add.group({
        defaultKey: 'asteroid',
        maxSize: 20
    });

    this.physics.add.collider(bullets, asteroids, hitAsteroid, null, this);
    this.physics.add.collider(player, asteroids, hitPlayer, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.time.addEvent({
        delay: 1000,
        callback: addAsteroid,
        callbackScope: this,
        loop: true
    });

    document.getElementById('up').addEventListener('touchstart', () => { moveUp = true; });
    document.getElementById('left').addEventListener('touchstart', () => { moveLeft = true; });
    document.getElementById('down').addEventListener('touchstart', () => { moveDown = true; });
    document.getElementById('right').addEventListener('touchstart', () => { moveRight = true; });

    document.getElementById('up').addEventListener('touchend', () => { moveUp = false; });
    document.getElementById('left').addEventListener('touchend', () => { moveLeft = false; });
    document.getElementById('down').addEventListener('touchend', () => { moveDown = false; });
    document.getElementById('right').addEventListener('touchend', () => { moveRight = false; });

    document.getElementById('shoot').addEventListener('touchstart', shoot);

    document.getElementById('restart').addEventListener('click', () => {
        score = 0;
        gameOver = false;
        document.getElementById('restart').style.display = 'none';
        this.scene.restart();
    });
}

function update() {
    if (gameOver) {
        return;
    }

    player.setVelocity(0);

    if (cursors.left.isDown || moveLeft) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown || moveRight) {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown || moveUp) {
        player.setVelocityY(-300);
    } else if (cursors.down.isDown || moveDown) {
        player.setVelocityY(300);
    }

    if (Phaser.Input.Keyboard.JustDown(shootKey)) {
        shoot();
    }
}

function shoot() {
    const bullet = bullets.get(player.x, player.y - 20);
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-300);
    }
}

function addAsteroid() {
    const x = Phaser.Math.Between(0, 800);
    const asteroid = asteroids.get(x, 0);
    if (asteroid) {
        asteroid.setActive(true);
        asteroid.setVisible(true);
        asteroid.setVelocityY(200);
    }
}

function hitAsteroid(bullet, asteroid) {
    bullet.setActive(false);
    bullet.setVisible(false);
    asteroid.setActive(false);
    asteroid.setVisible(false);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitPlayer(player, asteroid) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    scoreText.setText('Game Over! Score: ' + score);
    document.getElementById('restart').style.display = 'block';
}
