import { _decorator, systemEvent, Color, resources, Component, Node, Input, EventMouse, Sprite, SpriteFrame, assetManager, find, Vec2, UITransform, Vec3, math, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('canvas')
export class canvas extends Component {
    @property(Node)
    moleNode: Node = null;
    @property(Node)
    timeLabel: Node = null;
    @property(Node)
    subMenu: Node = null;
    private remainingTime: number = 30;
    private molExist: boolean = true;
    private moles: Node[] = [];
    private moleScale: any = { 'x': 0.951, 'y': 0.529 }
    private molePos: any = [
        {
            'x': -624.344,
            'y': 162.595
        },
        {
            'x': 0,
            'y': 162.595
        },
        {
            'x': 615.489,
            'y': 162.595
        },
        {
            'x': -619.917,
            'y': -23.911
        },
        {
            'x': 4.428,
            'y': -23.911
        },
        {
            'x': 619.917,
            'y': -23.911
        },
        {
            'x': -619.917,
            'y': -212.809
        },
        {
            'x': 4.428,
            'y': -212.809
        },
        {
            'x': 619.917,
            'y': -212.809
        }
    ]
    start() {
        //Ẩn sub menu
        this.subMenu = find('Canvas/SubMenu');
        this.subMenu.active = false;
        //Lấy moleNode
        this.moleNode = find('Canvas/Mole');
        //Lấy mảng mole trong colllection
        this.moles = find('MoleCollection').children;
        //Lấy timeLabel
        this.timeLabel = find('Canvas/TimeCounterDown');
    }

    onLoad() {
        // Cập nhật ngay lập tức để hiển thị thời gian ban đầu
        this.updateTimeLabel();

        // Bắt đầu bộ đếm ngược 
        this.schedule(this.updateTimer, 1);

        // Đăng ký sự kiện hoặc điều kiện để dừng game
        this.node.on('stopGame', this.stopGame, this);
    }

    updateTimer() 
    { 
        if (this.remainingTime > 0) 
        { 
            this.remainingTime--; 
            this.updateTimeLabel(); 
        } 
        else 
        { 
            // Hết giờ, dừng game
            this.stopGame();
            //Hiện sub menu
            this.subMenu.active = true;
        } 
    } 
    
    updateTimeLabel() 
    { 
        if (this.timeLabel) 
        { 
            this.timeLabel.getComponent(Label).string = this.remainingTime.toString() + 's'; 
        }
    }

    update(deltaTime: number) {
        if(this.molExist) {
            this.randomMole();
        }
    }

    randomMole() {
        this.molExist = false;
        //Reset màu chuột
        this.moleNode.getComponent(Sprite).color = new Color(255, 255, 255);
        //random loại chuột
        let molenameIndx = Math.floor(Math.random() * this.moles.length);
        //random vị trí chuột
        let moleposition = Math.floor(Math.random() * this.molePos.length);
        // đặt thuộc tính cho chuột
        this.moleNode.getComponent(Sprite).spriteFrame = this.moles[molenameIndx].getComponent(Sprite).spriteFrame;
        this.moleNode.setPosition(this.molePos[moleposition].x, this.molePos[moleposition].y);
        this.moleNode.setScale(this.moleScale.x, this.moleScale.y);
        // hiển thị chuột
        this.moleNode.active = true;
        let timeout = setTimeout(() => {
            this.moleNode.active = false;
            this.molExist = true
        }, 950);
    }
    
    stopGame() 
    { 
        //Ẩn mole
        this.moleNode.active = false;
        director.pause();  
        // Phát sự kiện tùy chỉnh 'game-paused' 
        systemEvent.emit('game-paused');
    }

    resetGame() {
        this.remainingTime = 30;
        this.updateTimeLabel();
        this.subMenu.active = false;
        director.resume();
    }
}


