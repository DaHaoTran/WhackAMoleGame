import { _decorator, Color, systemEvent, resources, Component, Node, Input, EventMouse, Sprite, SpriteFrame, assetManager, find, Vec2, UITransform, Vec3, math, AudioSource, Label, PostProcessStage, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('molehitted')
export class molehitted extends Component {
    @property(Node)
    private moleNode: Node = null;
    @property(Node)
    private hitSoundNode : Node = null;
    @property(Node)
    private hitCounter: Node = null;
    @property(Node)
    private moleBom: Node = null;
    @property(Node)
    private explosound: Node = null;
    @property(Node)
    scoreLabel: Node = null;
    @property(Node)
    highScoreLabel: Node = null;
    public colorEfect: Color = new Color(255, 255, 255);
    private counthit: number = 0;
    private moleScale: any = { 'x': 0.951, 'y': 0.317 }
    start() {
        //Reset hit count
        this.counthit = 0;
        // Lấy moleNode
        this.moleNode = find('Canvas/Mole');
        // Lấy hitSoundNode
        this.hitSoundNode = find('Sounds/HitSound');
        // Lấy hitCounter
        this.hitCounter = find('Canvas/HitCounter');
        //Lấy mole bom
        this.moleBom = find('MoleCollection/molebom');
        // Lấy explosound node
        this.explosound = find('Sounds/ExplosionSound');
        //Đăng ký sự kiện click chuột
        this.node.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onLoad() {
        // Lấy score label
        this.scoreLabel = find('Canvas/SubMenu/Score');
        // Lấy high score label
        this.highScoreLabel = find('Canvas/SubMenu/HighScore');
        // Đăng ký sự kiện 'game-paused' 
        systemEvent.on('game-paused', this.onGamePaused, this);
        //Đăng ký sự kiện hoặc điều kiện để reset game
        this.node.on('back-menu', this.resetGame, this);
        //Đăng ký sự kiện hoặc điều kiện để đặt màu hiệu ứng
        //this.node.on('change-theme', this.changeTheme, this);
    }

    /*changeTheme(colorset: Color) {
        this.colorEfect = colorset;
        console.log(this.colorEfect);
    }*/

    onGamePaused() {
        this.showresult();
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) 
        { 
            //Đặt scale cho node Mole
            this.moleNode.setScale(this.moleScale.x, this.moleScale.y);
            if(this.moleNode.getComponent(Sprite).spriteFrame === this.moleBom.getComponent(Sprite).spriteFrame) {
                // Thay đổi màu Mole
                this.moleNode.getComponent(Sprite).color = new Color(0, 0, 0);
                //Play hiệu hứng đập trúng chuột
                this.explosound.getComponent(AudioSource).play();
                // Giảm hit count
                if(this.counthit - 1 > 0) {
                    this.counthit -= 1;
                }
                //Hiển thị hit count
                this.updateHitCounter();
            }
            else {
                //Play hiệu hứng đập trúng chuột
                this.hitSoundNode.getComponent(AudioSource).play();
                //Thay đổi màu Mole
                this.moleNode.getComponent(Sprite).color = this.colorEfect; 
                //Tăng hit count
                this.counthit += 1;
                //Hiển thị hit count
                this.updateHitCounter(); 
            }
        } 
        else {
            this.hitSoundNode.getComponent(AudioSource).pause();
        }
    }

    updateHitCounter() {
        this.hitCounter.getComponent(Label).string = "Hit: " + this.counthit;
    }

    resetGame() {
        this.counthit = 0;
        this.updateHitCounter();
    }

    showresult() {
        //Hiện score đạt được
        this.scoreLabel.getComponent(Label).string = "Score: " + this.counthit;
        //Hiện score cao nhất
        this.highScoreLabel.getComponent(Label).string = "High Score: " + this.counthit;
    }
}


