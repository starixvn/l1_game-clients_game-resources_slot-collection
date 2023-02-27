import NodeObserver from "./NodeObserver";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteObserver extends NodeObserver {
  private sprite: cc.Sprite;
  onLoad(): void {
    super.onLoad();
    this.sprite = this.node.getComponent(cc.Sprite);
  }

  onEvent(param: any) {
    this.sprite.spriteFrame = param;
  }
}
