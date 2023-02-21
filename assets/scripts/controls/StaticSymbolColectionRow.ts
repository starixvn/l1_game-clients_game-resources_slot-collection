// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolColectionRow extends SelectionItem {
  private content: cc.Node;
  private itemSample: cc.Node;

  onLoad() {
    this.content = this.node.getChildByName("content");
    this.itemSample = this.node.getChildByName("item-sample");
    super.onLoad();
  }

  addSymbols(spriteFrames: cc.SpriteFrame[]) {
    spriteFrames.forEach((sprite) => {
      const node = cc.instantiate(this.itemSample);
      node.active = true;
      this.content.addChild(node);
      const spriteNode = node.getChildByName("image");
      spriteNode.getComponent(cc.Sprite).spriteFrame = sprite;
      //   const spine = iconNode.getComponent(sp.Skeleton);
      //   spine.skeletonData = skeleton;
      //   const iconWidth = iconNode.width || 150;
      //   iconNode.scale = this.itemSample.width / iconWidth;
      //   const anims = spine.skeletonData.getRuntimeData().animations;
      //   if (GameUtils.checkNameSpine(anims)) {
      //     spine.setAnimation(0, "idle", true);
      //   } else {
      //     spine.setAnimation(0, anims[0].name, true);
      //   }
    });
  }
}
