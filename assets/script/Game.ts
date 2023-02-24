// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from './Player'
import Manager from './Manager'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property({ type: cc.Node })
    ground: cc.Node = null;
    scoreDisplay: cc.Label = null;

    scoreAudio: cc.AudioClip = null;
    starPrefab: cc.Prefab = null;
    maxStarDuration: number = 6;
    minStarDuration: number = 3;

    Player: cc.Node = null;
    starPool: cc.NodePool = null;

    starTimer: number = 0;
    starDuration: number = 5;

    score: number = 0;

    spawnNewStar() {
        let star: cc.Node = null;
        if (this.starPool.size() > 0) {
            star = this.starPool.get(this);

        } else {
            star = cc.instantiate(this.starPrefab);
        }
        this.node.addChild(star);
        star.opacity = 255;
        star.setPosition(this.getNewStarPostion());
        this.starTimer = 0;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);

    }

    despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
        this.score++;
        this.scoreDisplay.string = 'Score:' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    getNewStarPostion() {
        let randx = (Math.random() - 0.5) * this.node.width / 2;
        //cc.log('jumpHeight: ' + this.Player.getComponent(Player).jumpHeight)
        let randy = this.Player.getComponent(Player).jumpHeight
            * Math.random()
            + (this.ground.y + this.ground.height / 2) + 30;

        return cc.v2(randx, randy)
    }

    onPlayBtnClick() {
        cc.log('start');
        Manager.isPlaying = true;
        this.node.getChildByName('playBtn').setPosition(3000);
        this.Player.getComponent('Player').gameStart();
        this.spawnNewStar();
    }

    onLoad() {
        this.ground = this.node.getChildByName('ground');
        this.scoreDisplay = this.node.getChildByName('scoreLabel').getComponent(cc.Label);
        this.Player = this.node.getChildByName('player');

        let self = this;

        cc.loader.loadRes('prefabs/star', function (err, _prefab) {
            if (err != null) {
                cc.error(err);
            }
            //回调里面不能使用this
            self.starPrefab = _prefab;
            //self.spawnNewStar();
        });
        cc.loader.loadRes('audio/score', cc.AudioClip, function (err, _audio) {
            if (err != null) {
                cc.error(err);
            }
            self.scoreAudio = _audio;
        })

        this.starPool = new cc.NodePool('Star');

    }

    gameOver() {
        cc.log('game over');
        Manager.isPlaying = false;
        this.Player.getComponent('Player').gameOver();
        this.scoreDisplay.string = this.scoreDisplay.string + '\n game over';
    }

    update(dt) {
        if (Manager.isPlaying && this.starTimer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.starTimer += dt;
    }
}
