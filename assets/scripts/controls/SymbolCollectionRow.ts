import { REEL_ITEM_SIZE } from "../board/StandardSlotReelItem";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollectionRow extends SelectionItem {
  private content: cc.Node;
  private itemSample: cc.Node;

  onLoad() {
    this.content = this.node.getChildByName("content");
    this.itemSample = this.node.getChildByName("item-sample");
    super.onLoad();
  }

  addSymbol(skeleton: sp.SkeletonData) {
    const node = cc.instantiate(this.itemSample);
    node.active = true;
    this.content.addChild(node);
    const iconNode = node.getChildByName("icon");
    const spine = iconNode.getComponent(sp.Skeleton);
    spine.skeletonData = skeleton;
    const iconWidth = iconNode.width || REEL_ITEM_SIZE;
    iconNode.scale = this.itemSample.width / iconWidth;
    const anims = spine.skeletonData.getRuntimeData().animations;
    if (GameUtils.checkNameSpine(anims)) {
      spine.setAnimation(0, "idle", true);
    } else {
      spine.setAnimation(0, anims[0].name, true);
    }
  }

  addSymbols(skeletons: sp.SkeletonData[]) {
    skeletons.forEach((skeleton) => {
      this.addSymbol(skeleton);
    });
  }
}
