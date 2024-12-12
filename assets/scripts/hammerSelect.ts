import { _decorator, Component, Node, Color, find, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('hammerSelect')
export class hammerSelect extends Component {
    private skinArr: any = [
        {
            'name': 'Basic',
            'color': new Color(255, 255, 255)
        },
        {
            'name': 'Christmas',
            'color': new Color(88, 206, 243, 255)
        }
    ] 
    private skinLength: number = 0;
    private indx: number = -1;
    private isGenerating: boolean = false;
    private skinNodes: Node[] = [];
    @property(Node)
    hammerNode: Node = null;
    @property(Node)
    hammerSkins: Node = null;
    @property(Node)
    hitAudioEffect: Node = null;
    start() {
        //Lấy hammer node
        this.hammerNode = find('Select/HammerSelect/Hammer');
    }

    protected onLoad(): void {
        //Load skin nodes
        this.LoadSkinNodes();
    }

    Forward() {
        if(this.isGenerating == false) {
            this.isGenerating = true;
            //Kiểm tra điều kiện
            if(this.indx + 1 <= this.skinLength - 1) {
                this.indx += 1;
            }
            else {
                this.indx = 0;
            }
            this.VisualSkin(this.skinNodes[this.indx]);
        }
    }

    Backward() {
        if(this.isGenerating == false) {
            this.isGenerating = true;
            //Kiểm tra điều kiện
            if(this.indx - 1 >= 0) {
                this.indx -= 1;
            }
            else {
                this.indx = this.skinLength - 1;
            }
            this.VisualSkin(this.skinNodes[this.indx]);
        }
    }

    VisualSkin(node: Node) {
        if(this.hammerNode) {
            //gán node để hiển thị
            this.hammerNode.getComponent(Sprite).spriteFrame = node.getComponent(Sprite).spriteFrame;
        }
        this.isGenerating = false;
    }

    LoadSkinNodes() {
        this.skinArr.forEach(element => {
            //tìm node
            const gnode: Node = find('HammerSkins/' + element.name);
            if(gnode) {
                this.skinNodes.push(gnode);
            }
        });
        this.skinLength = this.skinNodes.length;
    }
}


