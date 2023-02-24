// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Manager from "./Manager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';
    //跳跃高度
    @property
    jumpHeight: number = 200;
    //跳跃持续时间
    @property
    jumpDuration: number = 0.5;
    //最大移动速度
    @property
    maxMoveSpeed: number = 400;
    //加速度
    @property
    accel: number = 200;

    accLeft: boolean = false;
    accRight: boolean = false;
    xSpeed: number = 0;

    runJumpAction() {
        // jumpUP sin正弦函数，sineOut速度由快到慢
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        //jumpDown sin正弦函数，sineIn速度由慢到快
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

        var tween = cc.tween().sequence(jumpUp, jumpDown);
        return cc.tween().repeatForever(tween);
    }

    onKeyDown(event) {

        //  cc.log(event);
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft = false;
                this.accRight = true;
                break;

        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
        }
    }

    getCenterPos() {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
    }

    onTouchBegan(event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width / 2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
        // don't capture the event
        return true;
    }

    onTouchEnded(event) {
        this.accLeft = false;
        this.accRight = false;
    }
    onLoad() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // touch input
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    gameStart() {
        var action = this.runJumpAction();
        cc.tween(this.node).then(action).start();
    }

    gameOver() {
        this.node.stopAllActions();
    }

    start() {
        cc.log('cc-cc');
    }

    update(dt) {
        if (!Manager.isPlaying) {
            return;
        }
        //更新速度;
        if (this.accLeft) {
            this.xSpeed -= dt * this.accel;
        } else if (this.accRight) {
            this.xSpeed += dt * this.accel;
        }

        //限制速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.xSpeed / Math.abs(this.xSpeed) * this.maxMoveSpeed;
        }

        //左右移动
        this.node.x += this.xSpeed * dt;

        // 边界判断
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2;
            this.xSpeed = 0;
        }
    }
}
