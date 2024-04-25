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
        this.canJump = true; // Nueva variable para controlar el tiempo de espera antes de saltar

        // Configura la cámara para seguir al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.01, 0, 200);
        //this.cameras.main.setDeadzone(this.cameras.main.width / 2, 0);
    }

    update() {
        const speed = 5;
        const margin = 50;

        if (this.cursors.left.isDown && this.player.x > margin) {
            this.player.x -= speed;
        } else if (this.cursors.right.isDown) {
            this.player.x += speed;
        }

        // Comprueba si el jugador está en el suelo y permite el salto
        if (this.cursors.up.isDown && this.player.y > margin && this.isOnGround && !this.hasJumped && this.canJump) {
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
    }

    jump() {
        this.player.y -= this.jumpSpeed; // Hace que el jugador suba más rápido
        this.hasJumped = true;
        this.isOnGround = false;
        this.canJump = false; // El jugador no puede saltar inmediatamente después de saltar

        // Hace que el jugador caiga después de un corto período de tiempo
        this.time.delayedCall(600, () => {
            this.fall();
        });

        // Agrega un retraso antes de que el jugador pueda saltar de nuevo
        this.time.delayedCall(1000, () => { // Cambia 1000 a la cantidad de milisegundos que quieras esperar
            this.canJump = true;
        });
    }

    fall() {
        this.player.y += this.jumpSpeed; // Hace que el jugador caiga más rápido
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
