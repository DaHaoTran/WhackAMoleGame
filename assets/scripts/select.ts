import { _decorator, Component, Node, find, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('select')
export class select extends Component {
    @property(Node)
    selectSoundNode: Node = null;
    
    protected start(): void {
        //Lấy select sound node
        this.selectSoundNode = find('Sounds/SelectSound');
    }

    EscapeSelect() {
        //Phát select sound
        if(this.selectSoundNode) {this.selectSoundNode.getComponent(AudioSource).play();}
        //Ẩn select node
        this.node.active = false;
    }
}


