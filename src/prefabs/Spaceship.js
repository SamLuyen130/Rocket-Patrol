class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this); 
        this.points = pointValue; 
        this.moveSpeed = game.settings.spaceshipSpeed; 
    }

    update() {
        // Move Spaceeship Left
        this.x -= this.moveSpeed; 
        if(this.x <= 0 - this.width) {
            this.reset(); 
        }
    }
    // position reset
    reset() {
        this.x = game.config.width; 
    }
}