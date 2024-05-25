import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {

        this.add.image(512, 384, 'bgGameOver');

        WebFont.load({
            google: {
                families: ['Itim']
            },
            active: () => {
                let tornarPartida = this.add.text(500, 490, 'TORNAR A COMENÇAR', {
                    fontFamily: 'Itim', fontSize: 30, color: '#FFFFFF',
                    align: 'center'
                }).setDepth(100).setOrigin(0.5);

                tornarPartida.setInteractive().on('pointerdown', () => {
                    this.scene.start('Game');
                });

                let menu = this.add.text(810, 640, 'MENÚ', {
                    fontFamily: 'Itim', fontSize: 30, color: '#FFFFFF',
                    align: 'center'
                }).setDepth(100).setOrigin(0.5);

                menu.setInteractive().on('pointerdown', () => {
                    this.scene.start('MainMenu');
                });
            }
        });
        

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
