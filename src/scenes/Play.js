class Play extends Phaser.Scene {
    constructor() {
        super("playScene"); 
    }

    preload() {
        // Loading the Images and Sprites
        this.load.image('rocket', './assets/rocket.png'); 
        this.load.image('spaceship', './assets/spaceship.png'); 
        this.load.image('starfield', './assets/starfield.png'); 

        // Load sprite Sheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64, 
            frameHeight: 32, 
            startFrame: 0, 
            endFrame: 9
        });
    }

    create() {
        // Place the background
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0); 
        // Green Rectangle
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0, 0); 
        // White Border
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0); 
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0); 
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0, 0); 
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0, 0); 
        
        // Add rocket player
        this.pRocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // Add Spaceships
        this.ship1 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0); 
        this.ship2 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5, 'spaceship', 0, 20).setOrigin(0, 0); 
        this.ship3 = new Spaceship(this, game.config.width + borderUISize * 6, borderPadding* 20, 'spaceship', 0, 10).setOrigin(0, 0); 

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config 
        this.anims.create({
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30 
        });

        // intiialize score
        this.p1Score = 0; 
        // Display Score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        fixedWidth: 100 
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // Game Over Flag
        this.gameOver = false; 
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart', scoreConfig).setOrigin(0.5);
            this.gameOver = true; 
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart();
        }

        this.starfield.tilePositionX -= starSpeed; 
        if (!this.gameOver) {
            // Update Rocket
            this.pRocket.update(); 
            // update Spaceships 
            this.ship1.update(); 
            this.ship2.update(); 
            this.ship3.update(); 
        }

        // Collision check 
        if(this.checkCollision(this.pRocket, this.ship3)) {
            this.pRocket.reset(); 
            this.shipExplode(this.ship3); 
        }
        if(this.checkCollision(this.pRocket, this.ship2)) {
            this.pRocket.reset(); 
            this.shipExplode(this.ship2); 
        }
        if(this.checkCollision(this.pRocket, this.ship1)) {
            this.pRocket.reset(); 
            this.shipExplode(this.ship1); 
        }
    }

    checkCollision(rocket, ship) {
        // AABB checking
        if ( rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true; 
        }
        else {
            return false; 
        }
    }

    shipExplode(ship) {
        ship.alpha = 0; 
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0); 
        boom.anims.play('explode'); 
        boom.on('animationcomplete', () => {
            ship.reset(); 
            ship.alpha = 1; 
            boom.destroy(); 
        }); 
        this.p1Score += ship.points; 
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }


    
}