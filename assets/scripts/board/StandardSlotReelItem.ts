import CollectionScene from "../CollectionScene";
import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import GameUtils from "../utils/GameUtils";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

export const REEL_ITEM_SIZE = 150;
@ccclass
export default class StandardSlotReelItem extends SlotReelItem {
  @property({ type: cc.Prefab, visible: false, override: true })
  itemPrefabs: cc.Prefab[] = [];

  private itemSample: cc.Node;
  onLoad() {
    super.onLoad();
    this.itemSample = this.node.getChildByName("item-sample");
    uiManager.emitterListener(Events.UPDATE_WINNING_ANIMATION, (node) => {
      // console.log("reel item listen winning change");
      this.winningEffect.destroyAllChildren();
      const effect = cc.instantiate(node);
      this.winningEffect.addChild(effect);
      effect.position = cc.v3();
    });
  }

  protected replaceItem(index: number) {
    this.content.removeAllChildren();

    const playAnimationIdle = (spine) => {
      const idleAnim = "idle";
      const iconWidth = spine.node.width || REEL_ITEM_SIZE;
      spine.node.scale = this.node.width / iconWidth;
      const anims = spine.skeletonData.getRuntimeData().animations;
      if (GameUtils.checkNameSpine(anims)) {
        spine.setAnimation(0, idleAnim, true);
      } else {
        spine.setAnimation(0, anims[0].name, true);
      }
    };
    const data = CollectionScene.symbolsSkeletons[index];
    if (data instanceof sp.SkeletonData) {
      const node = cc.instantiate(this.itemSample);
      node.name = "icon";
      this.content.addChild(node);

      const spine = node.getComponent(sp.Skeleton);
      if (spine) {
        spine.skeletonData = data;
        spine.premultipliedAlpha = false;

        playAnimationIdle(spine);
      }
    }

    if (data instanceof cc.Node) {
      const node = cc.instantiate(data);
      node.position = cc.v3();
      node.name = "icon";
      this.content.addChild(node);

      const spine = node.getComponent(sp.Skeleton);
      if (spine) {
        playAnimationIdle(spine);
      }
    }
  }

  showWinningEffect(show: boolean) {
    this.winningEffect.active = show;
    this.content.children.forEach((child) => {
      const spine = child.getComponent(sp.Skeleton);
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
