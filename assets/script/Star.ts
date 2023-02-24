// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Game from './Game'
@ccclass
export default class NewClass extends cc.Component {

    //星星和player距离小于它会被收集
    pickRadius: number = 50;
    game: Game = null;
    onLoad() {
        this.game = this.node.parent.getComponent('Game')
    }

    start() {

    }
    getDistance() {
        let playerPos = this.game.Player.getComponent('Player').getCenterPos();
        return this.node.position.sub(playerPos).mag();
    }
    update(dt) {
        if (this.getDistance() < this.pickRadius) {
            this.game.despawnStar(this.node);
        }

        let duration = this.node.parent.getComponent('Game').starDuration;
        let timer = this.node.parent.getComponent('Game').starTimer;

        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - timer / duration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));

    }
}
