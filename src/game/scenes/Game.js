import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.score = 0;
        this.playerMoved = false;
        this.life = 3;
        this.timeLeft = 20;
        this.bg = this.add.tileSprite(50, 0, this.scale.width * 4, this.scale.height, 'bgJoc');

        // Temporizador para cambiar el fondo cada cierto tiempo
        this.time.addEvent({
            delay: 5000, // Cambia cada 5 segundos (5000 milisegundos)
            loop: true,
            callback: () => {
                const backgrounds = ['bgJoc', 'bg2', 'bg3'];
                const randomIndex = Phaser.Math.Between(0, backgrounds.length - 1);
                const randomBackground = backgrounds[randomIndex];
                this.bg.setTexture(randomBackground);
            }
        });

        this.scoreText = this.add.text(70, 150, 'Puntuació:' + this.score);
        this.timeText = this.add.text(this.scale.width - 120, 100, 'Temps: ' + this.timeLeft); // Ajusta la posición del tiempo
        this.lifeText = this.add.text(70, 100, 'Vida:' + this.life);
        this.bg.setOrigin(0, 0);

        this.player = this.add.image(70, 500, 'personatge').setScale(0.3);
        this.player.setOrigin(0, 0);
        this.scoreText.setScrollFactor(0);
        this.lifeText.setScrollFactor(0);
        this.timeText.setScrollFactor(0);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.isOnGround = true;
        this.hasJumped = false;
        this.jumpSpeed = 60;
        this.canJump = true;

        this.cameras.main.startFollow(this.player, true, 0.05, 0.01);
        this.cameras.main.setBounds(0, 0, this.bg.width, this.bg.height);
        this.cameras.main.centerOn(this.player.x, this.player.y);
        const minX = this.player.displayWidth / 2 + 200;
        const maxX = this.bg.width - this.player.displayWidth / 2 - 300;
        this.stars = [];

        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(minX, maxX);
            let y = Phaser.Math.Between(0, 1) === 0 ? 475 : 570;
            let star = this.add.image(x, y, 'estrella').setScale(0.2);
            star.setOrigin(0.5, 0.5);
            this.stars.push(star);
        }

        this.focs = [];
        for (let i = 0; i < 4; i++) {
            let x, positionTaken;
            let y = 570;
            do {
                x = Phaser.Math.Between(minX, maxX);
                positionTaken = this.stars.some(star => {
                    const distanceX = Math.abs(star.x - x);
                    const distanceY = Math.abs(star.y - y);
                    return distanceX < 50 && distanceY < 50;
                });
            } while (positionTaken);

            let foc = this.add.image(x, y, 'foc').setScale(0.1);
            foc.setOrigin(0.5, 0.5);
            this.focs.push(foc);
        }
    }

    updateTimer() {
        this.timeLeft--;
        this.timeText.setText('Temps: ' + this.timeLeft);

        if (this.timeLeft <= 0 && this.score <= 9) {
            this.changeScene();
        } else if (this.timeLeft <= 0 && this.score >= 10) {
            this.scene.start('Win');
        }
    }

    update() {
        const speed = 5;
        const margin = 50;
        const playerWidth = this.player.displayWidth;
        if (this.cursors.left.isDown && this.player.x - playerWidth / 20 > margin) {
            this.player.x -= speed;
            this.playerMoved = true;
        } else if (this.cursors.right.isDown && this.player.x + playerWidth / 2 < this.bg.width - margin) {
            this.player.x += speed;
            this.playerMoved = true;
        }
        if (this.cursors.up.isDown && this.player.y > margin && this.isOnGround && !this.hasJumped && this.canJump) {
            this.jump();
            this.playerMoved = true;
        }
        if (this.player.y < 500) {
            this.isOnGround = false;
        } else {
            this.isOnGround = true;
            this.hasJumped = false;
        }
        for (let i = 0; i < this.stars.length; i++) {
            let star = this.stars[i];
            const distanceX = Math.abs(this.player.x + this.player.displayWidth / 2 - (star.x + star.displayWidth / 2));
            const distanceY = Math.abs(this.player.y + this.player.displayHeight / 2 - (star.y + star.displayHeight / 2));
            const minDistance = 50;
            if (distanceX < minDistance && distanceY < minDistance) {
                star.destroy();
                this.collectStar();
                this.stars.splice(i, 1);
                i--;
            }
        }
        if (this.playerMoved && !this.timeEvent) {
            this.timeEvent = this.time.addEvent({
                delay: 1000,
                callback: this.updateTimer,
                callbackScope: this,
                loop: true
            });
        }
        for (let i = 0; i < this.focs.length; i++) {
            let foc = this.focs[i];
            const distanceX = Math.abs(this.player.x + this.player.displayWidth / 2 - (foc.x + foc.displayWidth / 2));
            const distanceY = Math.abs(this.player.y + this.player.displayHeight / 2 - (foc.y + foc.displayHeight / 2));
            const minDistance = 50;
            if (distanceX < minDistance && distanceY < minDistance) {
                foc.destroy();
                this.collectFoc();
                this.focs.splice(i, 1);
                i--;
            }
        }
    }

    collectStar() {
        this.score++;
        this.scoreText.setText('Puntuació: ' + this.score);
        const plusOneText = this.add.text(this.player.x, this.player.y + 50, '+1', {
            font: '20px Arial',
            fill: '#77FF5B'
        }).setOrigin(0.5, 0.5);

        this.time.delayedCall(1000, () => {
            this.player.clearTint();
            plusOneText.destroy();
        });
    }

    collectFoc() {
        this.life--;
        this.lifeText.setText('Vida: ' + this.life);
        this.player.setTint(0xff0000);
        const minusOneText = this.add.text(this.player.x, this.player.y + 50, '-1', {
            font: '20px Arial',
            fill: '#ff0000'
        }).setOrigin(0.5, 0.5);

        this.time.delayedCall(1000, () => {
            this.player.clearTint();
            minusOneText.destroy();
        });

        if (this.life === 0) {
            this.changeScene();
        }
    }

    jump() {
        this.player.y -= this.jumpSpeed;
        this.hasJumped = true;
        this.isOnGround = false;
        this.canJump = false;
        this.time.delayedCall(600, () => {
            this.fall();
        });
        this.time.delayedCall(1000, () => {
            this.canJump = true;
        });
    }

    fall() {
        this.player.y += this.jumpSpeed;
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
