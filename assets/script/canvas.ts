import { _decorator, systemEvent, Color, resources, Component, Node, Input, EventMouse, Sprite, SpriteFrame, assetManager, find, Vec2, UITransform, Vec3, math, Label, director } from 'cc';
const { ccclass, property } = _decorator;
const _eventTarget = new EventTarget();

@ccclass('canvas')
export class canvas extends Component {
    @property(Node)
    moleNode: Node = null;
    @property(Node)
    timeLabel: Node = null;
    @property(Node)
    subMenu: Node = null;
    @property(Node)
    startLabel: Node = null;
    @property(Node)
    canvasNode: Node = null;
    private isStart = false;
    private remainingTime: number = 3;
    private remainingTime2: number = 3;
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
        //Lấy canvasNode
        this.canvasNode = find('Canvas');
        this.canvasNode.active = false;
        //Lấy timeLabel
        this.timeLabel = find('Canvas/TimeCounterDown');
        //Lấy startLabel
        this.startLabel = find('Canvas/StartCounter');
        //Lấy moleNode
        this.moleNode = find('Canvas/Mole');
        //Lấy mảng mole trong colllection
        this.moles = find('MoleCollection').children;
        //Ẩn sub menu
        this.subMenu = find('Canvas/SubMenu');
        this.subMenu.active = false;
        //
        this.isStart = false;
    }

    onLoad() {
        // Cập nhật ngay lập tức để hiển thị thời gian ban đầu
        this.updateTimeLabel();

        // Cập nhật ngay lập tức để hiển thị thời gian ban đầu
        this.updateStartLabel();

        // Bắt đầu bộ đếm ngược 
        this.schedule(this.updateStartTimer, 1);

        // Đăng ký sự kiện hoặc điều kiện để dừng game
        this.node.on('stopGame', this.stopGame, this);

        //Đăng ký sự kiện hoặc điều kiện để reset game
        this.node.on('back-menu', this.resetGame, this);
    }

    protected onDestroy(): void {
        //Hủy các sự kiện đăng ký
        this.node.off('stopGame', this.stopGame, this);
        // Hủy tất cả các lịch trình đã lên lịch trên scheduler 
        director.getScheduler().unschedule(this.updateStartTimer, this);
    }

    updateStartTimer() {
        if (this.remainingTime2 > 0) 
        { 
            this.remainingTime2--; 
            this.updateStartLabel(); 
        } 
        else 
        { 
            // Hết giờ
            this.isStart = true;
            //Ẩn start label
            this.startLabel.active = false;
            // Bắt đầu bộ đếm ngược 
            this.schedule(this.updateTimer, 1);
            //Hiện mole
            this.moleNode.active = true;
        } 
    }

    updateTimer() 
    { 
        if(this.isStart) {
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
    } 
    
    updateTimeLabel() 
    { 
        if (this.timeLabel) 
        { 
            this.timeLabel.getComponent(Label).string = this.remainingTime.toString() + 's'; 
        }
    }

    updateStartLabel() {
        if(this.startLabel) {
            if(this.remainingTime2 > 0) {
                this.startLabel.getComponent(Label).string = this.remainingTime2.toString();
            }
            else {
                this.startLabel.getComponent(Label).string = "GO";
            }
        }
    }

    update(deltaTime: number) {
        if(this.isStart) {
            if(this.molExist) {
                this.randomMole();
            }
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
        this.isStart = false;
        this.remainingTime = 3;
        this.remainingTime2 = 3;
        this.updateTimeLabel();
        this.updateStartLabel();
        this.subMenu.active = false;
        this.startLabel.active = true;
        director.resume();
        this.onLoad();
    }
}


