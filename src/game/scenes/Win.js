import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
export class Win extends Scene {
    constructor() {
        super('Win');
    }

    create() {
        this.add.image(512, 384, 'bgGameOver').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene()
    {
        this.scene.start('GameOver');
    }
}