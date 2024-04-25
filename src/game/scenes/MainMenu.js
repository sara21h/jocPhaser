import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 100, 'logo').setDepth(100).setScale(0.4);

        this.add.image(512, 350, 'botoPlay').setScale(0.4);


        this.add.image(512, 450, 'botoSortir').setScale(0.5);
        this.add.image(170, 630, 'botoSettings').setScale(0.25);



        WebFont.load({
            google: {
                families: ['Itim']
            },
            active: () => {
                let jugarTexto = this.add.text(512, 360, 'JUGAR', {
                    fontFamily: 'Itim', fontSize: 20, color: '#5300FF',
                    align: 'center'
                }).setDepth(100).setOrigin(0.5);

                jugarTexto.setInteractive().on('pointerdown', () => {
                    this.scene.start('Game');
                });

                let sortir = this.add.text(512, 455, 'SORTIR', {
                    fontFamily: 'Itim', fontSize: 20, color: '#5300FF',
                    align: 'center'
                }).setDepth(100).setOrigin(0.5);

                sortir.setInteractive().on('pointerdown', () => {
                    window.close();
                });
            }
        });


        
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        }
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    vueCallback({
                        x: Math.floor(this.logo.x),
                        y: Math.floor(this.logo.y)
                    });
                }
            });
        }
    }
}
