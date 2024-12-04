import { _decorator, Component, director, Node, EventTarget, find, AudioSource} from 'cc';
import { canvas } from './canvas';
const { ccclass, property } = _decorator;
const _eventTarget = new EventTarget();

@ccclass('menu')
export class menu extends Component {
    @property(Node)
    canvasNode: Node = null;
    @property(Node)
    menuNode: Node = null;
    @property(Node)
    selectSoundNode: Node = null;
    protected start(): void {
        //Lấy cavas node
        this.canvasNode = find('Canvas');
        //Lấy menu node
        this.menuNode = find('Menu');
        // Lấy select sound node
        this.selectSoundNode = find('Sounds/SelectSound');
    }
    StartGame() {
        //Phát select sound
        this.selectSoundNode.getComponent(AudioSource).play();
        //Ẩn menu
        if(this.menuNode) {
            this.menuNode.active = false;
        }
        //Hiện gameplay
        if(this.canvasNode) {
            this.canvasNode.active = true;
        }
    }

    EscapeGame() {
        //Phát select sound
        this.selectSoundNode.getComponent(AudioSource).play();
        //Thoát game
        director.end();
    }
}


