import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
export class Info extends Scene {
    constructor() {
        super('Info');
    }

    create() {
        this.add.image(512, 384, 'bg').setAlpha(0.5);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene()
    {
        this.scene.start('GameOver');
    }
}