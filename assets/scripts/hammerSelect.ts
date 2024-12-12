import { _decorator, Component, Node, Color, find, Sprite, AudioSource, Label } from 'cc';
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
    private skinNodes: any = [];
    @property(Node)
    hammerNormal: Node = null;
    @property(Node)
    hammerNode: Node = null;
    @property(Node)
    hammerSkins: Node = null;
    @property(Node)
    hitAudioEffect: Node = null;
    @property(Node)
    moleNode: Node = null;
    @property(Node)
    hitSoundNode: Node = null;
    @property(Node)
    selectButtonLabel: Node = null;
    start() {
        //Lấy hammer node
        this.hammerNode = find('Select/HammerSelect/Hammer');
        //Lấy hammer in game
        this.hammerNormal = find('Canvas/Hammer(Normal)');
        //Lấy mole node
        this.moleNode = find('Canvas/Mole');
        //Lấy hit sound node
        this.hitSoundNode = find('Sounds/HitSound');
        //lấy select button 
        this.selectButtonLabel = find('Select/HammerSelect/SelectButton/Label');
    }

    protected onLoad(): void {
        //Load skin nodes
        this.loadSkinNodes();
    }

    forward() {
        if(this.isGenerating == false) {
            this.isGenerating = true;
            //Kiểm tra điều kiện
            if(this.indx + 1 <= this.skinLength - 1) {
                this.indx += 1;
            }
            else {
                this.indx = 0;
            }
            this.visualSkin(this.skinNodes[this.indx]);
        }
    }

    backward() {
        if(this.isGenerating == false) {
            this.isGenerating = true;
            //Kiểm tra điều kiện
            if(this.indx - 1 >= 0) {
                this.indx -= 1;
            }
            else {
                this.indx = this.skinLength - 1;
            }
            this.visualSkin(this.skinNodes[this.indx]);
        }
    }

    visualSkin(node: Node) {
        if(this.hammerNode) {
            //gán node để hiển thị
            this.hammerNode.getComponent(Sprite).spriteFrame = node.getComponent(Sprite).spriteFrame;
        }
        this.isGenerating = false;
    }

    loadSkinNodes() {
        this.skinArr.forEach(element => {
            //tìm node
            const gnode: Node = find('HammerSkins/' + element.name);
            if(gnode) {
                let snode = { 'node': gnode, 'name': element.name, 'color': element.color };
                this.skinNodes.push(snode);
            }
        });
        this.skinLength = this.skinNodes.length;
    }

    onSelect() {
        if(this.isGenerating == false) {
            this.isGenerating = true;
            //Thay đổi skin hammer
            if(this.hammerNormal) {
                this.hammerNormal.getComponent(Sprite).spriteFrame = this.skinNodes[this.indx].node.getComponent(Sprite).spriteFrame;
            }
            //Thay đổi âm thanh hit
            this.hitAudioEffect = find('HitAudioEffects/' + this.skinNodes[this.indx].name);
            if(this.hitAudioEffect) {
                if(this.hitSoundNode) {
                    this.hitSoundNode.getComponent(AudioSource).clip = this.hitAudioEffect.getComponent(AudioSource).clip;
                }
            }
            //Phát sự kiện đổi color effect
            this.moleNode.emit('change-theme', this.skinNodes[this.indx].color);
            //Thay đổi trạng thái select button
            if(this.selectButtonLabel) {
                this.selectButtonLabel.getComponent(Label).string = "Selected";
            }
            else {
                this.selectButtonLabel.getComponent(Label).string = "Error";
            }
        }
    }
}


