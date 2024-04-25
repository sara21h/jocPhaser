import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.add.image(512, 384, 'bgJoc').setAlpha(0.5);
        this.player = this.add.image(500, 600, 'personatge').setScale(0.3);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Declara las variables fuera del método create()
        this.isOnGround = true;
        this.hasJumped = false;
        this.jumpSpeed = 60; // Ajusta la velocidad de salto
    }

    update() {
        const speed = 5;
        const margin = 50;

        if (this.cursors.left.isDown && this.player.x > margin) {
            this.player.x -= speed;
        } else if (this.cursors.right.isDown && this.player.x < this.cameras.main.width - margin) {
            this.player.x += speed;
        }

        // Comprueba si el jugador está en el suelo y permite el salto
        if (this.cursors.up.isDown && this.player.y > margin && this.isOnGround && !this.hasJumped) {
            // Realiza el salto
            this.jump();
        }

        // Comprueba si el jugador está en el aire y permite que vuelva a tocar el suelo
        if (this.player.y < 600) { // Cambia 600 por la posición y del suelo
            this.isOnGround = false;
        } else {
            // Marca que el jugador está en el suelo y permite un nuevo salto
            this.isOnGround = true;
            this.hasJumped = false;
        }

        //this.changeScene();
    }

    jump() {
        this.player.y -= this.jumpSpeed; // Hace que el jugador suba más rápido
        this.hasJumped = true;
        this.isOnGround = false;

        // Hace que el jugador caiga después de un corto período de tiempo
        this.time.delayedCall(250, () => {
            this.fall();
        });
    }

    fall() {
        this.player.y += this.jumpSpeed; // Hace que el jugador caiga más rápido
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}