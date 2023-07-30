class Tile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, value, hazard=false) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scored = false;
        this.isHazard = hazard;
        this.scoreValue = value;
    }

    checkCollision(player) {
        // simple AABB checking (Axis-Aligned Bounding Boxes)
        if (player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.height + player.y > this.y - 1 * this.isHazard) {
                return true;
            } else {
                return false;
        }
    }
    
}