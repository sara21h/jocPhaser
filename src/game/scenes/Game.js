import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Crea un TileSprite con el tamaño del mundo del juego
        this.bg = this.add.tileSprite(0, 0, this.scale.width * 2, this.scale.height, 'bgJoc');
        this.bg.setOrigin(0, 0); // Asegúrate de que el origen esté en la esquina superior izquierda

        // Añade el jugador después del fondo
        this.player = this.add.image(500, 500, 'personatge').setScale(0.3);
        this.player.setOrigin(0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Declara las variables fuera del método create()
        this.isOnGround = true;
        this.hasJumped = false;
        this.jumpSpeed = 60; // Ajusta la velocidad de salto
        this.canJump = true; // Nueva variable para controlar el tiempo de espera antes de saltar

        // Configura la cámara para seguir al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.01, 0, 100);

        const minX = this.player.displayWidth / 2 + 50; // La mitad del ancho del jugador desde el borde izquierdo
        const maxX = this.bg.width - this.player.displayWidth / 2 - 300; // El ancho del fondo menos la mitad del ancho del jugador desde el borde derecho
        
        //this.cameras.main.setDeadzone(this.cameras.main.width / 2, 0);
        for (let i = 0; i < 30; i++) {
            let x = Phaser.Math.Between(minX, maxX); // Posición horizontal aleatoria dentro del área del fondo
            let y = Phaser.Math.Between(0, 1) === 0 ? 570 : 500;

            let spaceFactor = 1.2; // Puedes ajustar este valor según la cantidad de espacio que desees
            x *= spaceFactor;
            
            let star = this.add.image(x, y, 'estrella').setScale(0.2);
            star.setOrigin(0.5, 0.5);
        }


    }

    update() {
        const speed = 5;
        const margin = 50;
        const playerWidth = this.player.displayWidth; // Obtiene el ancho del jugador

        if (this.cursors.left.isDown && this.player.x - playerWidth / 20 > margin) { // Asegúrate de que el jugador no se salga por la izquierda
            this.player.x -= speed;
        } else if (this.cursors.right.isDown && this.player.x + playerWidth / 2 < this.bg.width - margin) { // Asegúrate de que el jugador no se salga por la derecha
            this.player.x += speed;
        }

        // Comprueba si el jugador está en el suelo y permite el salto
        if (this.cursors.up.isDown && this.player.y > margin && this.isOnGround && !this.hasJumped && this.canJump) {
            // Realiza el salto
            this.jump();
        }

        // Comprueba si el jugador está en el aire y permite que vuelva a tocar el suelo
        if (this.player.y < 500) { // Cambia 600 por la posición y del suelo
            this.isOnGround = false;
        } else {
            // Marca que el jugador está en el suelo y permite un nuevo salto
            this.isOnGround = true;
            this.hasJumped = false;
        }
        // Ajusta la cámara para que deje de seguir al jugador cuando ya no haya más fondo
        //if (this.player.x + this.cameras.main.width / 2 > this.bg.width || this.player.x - this.cameras.main.width / 2 < 0) {
        //    this.cameras.main.stopFollow();
        //} else {
        //    this.cameras.main.startFollow(this.player, true, 0.05, 0.01, 0, 100);
        //}
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
