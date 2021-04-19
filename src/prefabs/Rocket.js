// Player prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); 

        // Add objects to scene
        scene.add.existing(this);
        this.isFiring = false; 
        this.moveSpeed = 2; 
        // sound
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        // Movement
        if(!this.isFiring) {
            if(keyLeft.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed; 
            }
            else if (keyRight.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        // Fire Button 
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true; 
            this.sfxRocket.play(); 
        }
        // If fired, move rocket up 
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed; 
        }
        // Resets on Missing
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset(); 
        }
    }

    // reset rocket to ground
    reset() {
        this.isFiring = false; 
        this.y = game.config.height - borderUISize - borderPadding;
    }
}