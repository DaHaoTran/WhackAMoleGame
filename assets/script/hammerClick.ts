import { _decorator, resources, Component, Node, Input, EventMouse, Sprite, SpriteFrame, assetManager, find, Vec2, UITransform, Vec3, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hammerClick')
export class hammerClick extends Component {
    @property(Node)
    hammerNode: Node = null;
    private allow: boolean = true;
    start() {
         //Lấy hammerNode
         this.hammerNode = find('Canvas/Hammer(Normal)');
        //Đăng ký sự kiện click chuột
        this.node.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseDown(event: EventMouse) 
    { 
        if (event.getButton() === 0) 
        { 
            if(this.allow) {
                this.allow = false;
                // Lấy vị trí click chuột trên màn hình 
                const clickPosition = event.getUILocation(); 
                // Chuyển đổi vị trí click từ màn hình sang không gian thế giới 
                const worldPosition = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(clickPosition.x, clickPosition.y, 0)); 
                // Đặt node Hammer tại vị trí click chuột 
                this.hammerNode.setPosition(worldPosition); 
                this.hammerNode.active = true;
                // Đặt thời gian chờ
                var update = setTimeout(() => {
                    this.allow = true;
                    this.hammerNode.active = false;
                }, 200);
            }
        } 
    }
            
}


