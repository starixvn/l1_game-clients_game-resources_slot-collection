import { REEL_ITEM_SIZE } from "../board/StandardSlotReelItem";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollectionRow extends SelectionItem {
  @property(cc.Label)
  packName: cc.Label = null;

  private content: cc.Node;
  private itemSample: cc.Node;

  private init() {
    this.content = this.node.getChildByName("content");
    this.itemSample = this.node.getChildByName("item-sample");
  }

  onLoad() {
    this.init();
    super.onLoad();
  }

  setItemId(id) {
    super.setItemId(id);
    this.packName.string = `Pack ${id}`;
  }

  addSymbol(skeleton: sp.SkeletonData) {
    this.init();

    const node = cc.instantiate(this.itemSample);
    node.active = true;
    this.content.addChild(node);
    const iconNode = node.getChildByName("icon");
    const spine = iconNode.getComponent(sp.Skeleton);
    spine.skeletonData = skeleton;
    const iconWidth = iconNode.width || REEL_ITEM_SIZE;
    const iconHeight = iconNode.height || REEL_ITEM_SIZE;
    iconNode.scale = Math.min(
      this.itemSample.width / iconWidth,
      this.itemSample.height / iconHeight
    );
    const anims = spine.skeletonData.getRuntimeData().animations;
    if (GameUtils.checkNameSpine(anims)) {
      spine.setAnimation(0, "idle", true);
    } else {
      spine.setAnimation(0, anims[0].name, true);
    }
    return node;
  }

  addSymbols(skeletons: sp.SkeletonData[]) {
    skeletons.forEach((skeleton) => {
      this.addSymbol(skeleton);
    });
  }
}
