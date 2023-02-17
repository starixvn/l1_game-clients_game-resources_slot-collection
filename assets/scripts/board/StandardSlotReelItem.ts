import CollectionScene from "../CollectionScene";
import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import GameUtils from "../utils/GameUtils";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotReelItem extends SlotReelItem {
  @property({ type: cc.Prefab, visible: false, override: true })
  itemPrefabs: cc.Prefab[] = [];

  private itemSample: cc.Node;
  onLoad() {
    super.onLoad();
    this.itemSample = this.node.getChildByName("item-sample");
    uiManager.emitterListener(Events.UPDATE_WINNING_ANIMATION, () => {
      // console.log("reel item listen winning change");
    });
  }

  protected replaceItem(index: number) {
    this.content.removeAllChildren();
    const node = cc.instantiate(this.itemSample);
    node.name = "icon";
    this.content.addChild(node);

    const spine = node.getComponent(sp.Skeleton);
    if (spine) {
      const anim = "idle";
      spine.skeletonData = CollectionScene.symbolsSkeletons[index];
      spine.premultipliedAlpha = true;
      const iconWidth = node.width || 140;
      node.scale = (this.node.width * 0.9) / iconWidth;
      const anims = spine.skeletonData.getRuntimeData().animations;
      if (GameUtils.checkNameSpine(anims)) {
        spine.setAnimation(0, "idle", true);
      } else {
        spine.setAnimation(0, anims[0].name, true);
      }
    }
  }

  showWinningEffect(show: boolean) {
    this.content.children.forEach((child) => {
      const spine = child.getChildByName("icon")?.getComponent(sp.Skeleton);
      if (spine) {
        const anim = show ? "highlight" : "idle";
        spine.setAnimation(0, anim, true);
      }
      this.showMoreEffect(child, show);
    });
  }
  showMoreEffect(node: cc.Node, show: boolean) {
    const effectNode = node.getChildByName("winningEffect");
    if (effectNode) {
      effectNode.active = show;
    }
  }
}
