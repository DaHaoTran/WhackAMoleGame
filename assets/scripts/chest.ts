import { _decorator, color, Component, find, Node, Sprite, UIOpacity, Color, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chest')
export class chest extends Component {
    @property(Node)
    backgroundGameNode: Node = null;
    start() {
        // Lấy background game node
        this.backgroundGameNode = find('Select/BackgroundGame');
    }

    OpenChest() {
        if(this.backgroundGameNode) {
            this.backgroundGameNode.getComponent(Sprite).color = new Color(128,128,128);
        }
        this.node.active = true;
        this.node.getComponent(Animation)?.play('showchest');
    }
}


