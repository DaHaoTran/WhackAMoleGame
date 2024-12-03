import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('backtohome')
export class backtohome extends Component {
    
    backToMenu() {
        director.loadScene('MenuScene');
    }
}


