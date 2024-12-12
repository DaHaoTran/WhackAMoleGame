import { _decorator, color, Component, find, Node, Sprite, UIOpacity, Color, Animation, AudioSource, Button } from 'cc';
import {  } from '@solana/web3.js';
import { solanaBusiness } from './solanaBusiness';
const { ccclass, property } = _decorator;

@ccclass('chest')
export class chest extends Component {
    @property(Node)
    OpenSoundNode: Node = null;

    private isOpen: boolean = false;
    start() {
        // Lấy open sound node
        this.OpenSoundNode = find('Sounds/OpenChest');
    }

    protected onLoad(): void {
        // Đăng ký sự kiện hoặc điều kiện để open chest
        this.node.on('open-chest', this.OpenChest, this);
        // Đăng ký sự kiện hoặc điều kiện để close chest
        this.node.on('close-chest', this.CloseChest, this);
    }

    ShowChest() {
        this.isOpen = false;
        this.node.active = true;
        this.node.getComponent(Animation)?.play('showchest');
    }

    OpenChest() {
        if(this.isOpen == false) {
            this.isOpen = true;
            this.node.getComponent(Animation).play('openchest');
            //play open sound
            setTimeout(() => {
                if(this.OpenSoundNode) {
                    this.OpenSoundNode.getComponent(AudioSource).play();
                }
            }, 500);
            setTimeout(() => {
                this.isOpen = false;
            }, 1000);
        }
    }
}


