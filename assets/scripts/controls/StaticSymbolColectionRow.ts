import { REEL_ITEM_SIZE } from "../board/StandardSlotReelItem";
import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticSymbolColectionRow extends SelectionItem {
  @property(cc.Label)
  packName: cc.Label = null;

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

  setItemId(id) {
    super.setItemId(id);
    this.packName.string = `Pack ${id}`;
  }

  addSymbol({ symbol, path }) {
    this.init();

    const node = cc.instantiate(this.itemSample);
    node.active = true;
    this.content.addChild(node);
    const spriteNode = node.getChildByName("image");
    (spriteNode.getComponent(cc.Sprite).spriteFrame = symbol), path;
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

    const dataNode = cc.instantiate(node);
    const nodeData = { symbol: dataNode, path };

    node.addComponent(cc.Button);
    node.on("click", () => {
      uiManager.emit(Events.UPDATE_ONE_SYMBOL, nodeData);
    });

    this.nodes.push(nodeData);
  }
}
