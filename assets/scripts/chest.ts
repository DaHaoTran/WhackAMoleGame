import { _decorator, color, Component, find, Node, Sprite, UIOpacity, Color, Animation, AudioSource, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chest')
export class chest extends Component {
    @property(Node)
    backgroundGameNode: Node = null;
    @property(Node)
    OpenSoundNode: Node = null;
    private isOpen: boolean = false;

    start() {
        // Lấy background game node
        this.backgroundGameNode = find('Select/BackgroundGame');
        // Lấy open sound node
        this.OpenSoundNode = find('Sounds/OpenChest');
    }

    ShowChest() {
        this.isOpen = false;
        if(this.backgroundGameNode) {
            this.backgroundGameNode.getComponent(Sprite).color = new Color(128,128,128);
        }
        this.node.active = true;
        this.node.getComponent(Animation)?.play('showchest');
    }

    OpenChest() {
        if(this.isOpen == false) {
            this.node.getComponent(Animation).play('openchest');
            //play open sound
            setTimeout(() => {
                if(this.OpenSoundNode) {
                    this.OpenSoundNode.getComponent(AudioSource).play();
                }
            }, 500);
            setTimeout(() => {
                this.isOpen = true;
            }, 1000);
        }
    }

    CloseChest() {
        if(this.isOpen) {
            this.isOpen = false;
            this.node.active = false;
            if(this.backgroundGameNode) {
                this.backgroundGameNode.getComponent(Sprite).color = new Color(255,255,255);
            }
        }
    }
}


