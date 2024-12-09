import { _decorator, Component, director, Node, EventTarget, find, AudioSource, Label} from 'cc';
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
    @property(Node)
    subMenuLabel: Node = null;
    @property(Node)
    subMenuNode: Node = null;
    @property(Node)
    selectNode: Node = null;
    private isConnected: boolean = false;

    protected start(): void {
        //Lấy cavas node
        this.canvasNode = find('Canvas');
        //Lấy menu node
        this.menuNode = find('Menu');
        // Lấy select sound node
        this.selectSoundNode = find('Sounds/SelectSound');
        //Lấy sub menu node
        this.subMenuNode = find('Menu/SubMenu');
        //Lấy sub menu label node
        this.subMenuLabel = find('Menu/SubMenu/Label');
        //Lấy select node
        this.selectNode = find('Select');
    }

    protected onLoad(): void {
        //Đăng ký sự kiện hoặc điều kiện để xác nhân kết nối ví
        this.node.on('connected-wallet', this.OnConnected, this);    
    }

    OnConnected() {
        this.isConnected = true;
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

    SelectGame() {
        //Phát select sound
        this.selectSoundNode.getComponent(AudioSource).play();
        //Kiểm tra kết nối ví
        if(this.isConnected) {
            if(this.selectNode) { this.selectNode.active = true;}
        }
        else {
            if(this.subMenuLabel) {this.subMenuLabel.getComponent(Label).string = 'This feature need to be connect wallet !';}
            if(this.subMenuNode) {this.subMenuNode.active = true;}
            setTimeout(() => {
                this.subMenuLabel.getComponent(Label).string = '';
                this.subMenuNode.active = false; 
              }, 3500);
        }
    }
}


