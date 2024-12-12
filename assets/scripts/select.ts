import { _decorator, Component, Node, find, AudioSource, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('select')
export class select extends Component {
    @property(Node)
    selectSoundNode: Node = null;
    @property(Node)
    chestNode: Node = null;
    @property(Node)
    backgroundGameNode: Node = null;
    @property(Node)
    hammerSelectNode: Node = null;

    protected start(): void {
        //Lấy select sound node
        this.selectSoundNode = find('Sounds/SelectSound');
        //Lấy chest node
        this.chestNode = find('Select/Chest');
        //Lấy background game node
        this.backgroundGameNode = find('Select/BackgroundGame');
        //Lấy hammer select node
        this.hammerSelectNode = find('Select/HammerSelect');
    }

    onBeforeOpenChest() {
        if(this.backgroundGameNode) {
            this.backgroundGameNode.getComponent(Sprite).color = new Color(188, 188, 188);
        }
        if(this.hammerSelectNode) {
            this.hammerSelectNode.active = false;
        }
    }

    onConfirmChest() {
        if(this.backgroundGameNode) {
            this.backgroundGameNode.getComponent(Sprite).color = new Color(255, 255, 255);
        }
        if(this.hammerSelectNode) {
            this.hammerSelectNode.active = true;
        }
        if(this.chestNode) {
            this.chestNode.active = false;
        }
    }

    EscapeSelect() {
        //Phát select sound
        if(this.selectSoundNode) {this.selectSoundNode.getComponent(AudioSource).play();}
        //Ẩn select node
        this.node.active = false;
        //Ẩn chest node
        this.chestNode.active = false;
        //Set màu cho background game node
        if(this.backgroundGameNode) {
            this.backgroundGameNode.getComponent(Sprite).color = new Color(255,255,255);
        }
        //Hiện hammer select node
        if(this.hammerSelectNode) {
            this.hammerSelectNode.active = true;
        }
    }
}


