import { _decorator, Component, Node, director, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('backtohome')
export class backtohome extends Component {
    @property(Node)
    canvasNode: Node = null;
    @property(Node)
    menuNode: Node = null;
    @property(Node)
    moleNode: Node = null;
    protected start(): void {
        //Lấy cavas node
        this.canvasNode = find('Canvas');
        //Lấy menu node
        this.menuNode = find('Menu');
        // Lấy mole node
        this.moleNode = find('Canvas/Mole');
    }
    backToMenu() {
        if(this.canvasNode) {
            //Phát sự kiện reset game
            this.canvasNode.emit('back-menu');
            this.moleNode.emit('back-menu');
            //Ẩn gameplay
            this.canvasNode.active = false;
        }
        //Hiện menu
        if(this.menuNode) {
            this.menuNode.active = true;
        }
    }
}


