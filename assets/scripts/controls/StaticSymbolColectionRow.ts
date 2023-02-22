import { REEL_ITEM_SIZE } from "../board/StandardSlotReelItem";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolColectionRow extends SelectionItem {
  private content: cc.Node;
  private itemSample: cc.Node;

  nodes = [];

  onLoad() {
    this.init();
    super.onLoad();
  }

  private init() {
    this.content = this.node.getChildByName("content");
    this.itemSample = this.node.getChildByName("item-sample");
  }

  addSymbol(sprite) {
    this.init();

    const node = cc.instantiate(this.itemSample);
    node.active = true;
    this.content.addChild(node);
    const spriteNode = node.getChildByName("image");
    spriteNode.getComponent(cc.Sprite).spriteFrame = sprite;
    const spine = node.getComponent(sp.Skeleton);
    node.scale = Math.min(
      REEL_ITEM_SIZE / spriteNode.width,
      REEL_ITEM_SIZE / spriteNode.height
    );
    const anims = spine.skeletonData.getRuntimeData().animations;
    if (GameUtils.checkNameSpine(anims)) {
      spine.setAnimation(0, "idle", true);
    } else {
      spine.setAnimation(0, anims[0].name, true);
    }

    this.nodes.push(node);
  }

  addSymbols(spriteFrames: cc.SpriteFrame[]) {
    spriteFrames.forEach((sprite) => {
      this.addSymbol(sprite);
    });
  }
}
