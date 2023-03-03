import { REEL_ITEM_SIZE } from "../board/StandardSlotReelItem";
import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SelectionItem from "../selection-control/SelectionItem";
import SpriteSheetAnimation from "../SpriteSheetAnimation";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinningAnimationCollection extends SelectionControl {
  private _nodes = [];
  async initItems() {
    const allData = cc.resources.getDirWithPath(
      "winning-animations",
      cc.SpriteAtlas
    );
    let i: number = 0;
    for (const key of Object.keys(allData)) {
      const data = allData[key];
      const path: string = data.path;
      const atlas = await GameUtils.loadResource<cc.SpriteAtlas>(
        path,
        cc.SpriteAtlas
      );
      if (atlas) {
        const node = new cc.Node();
        node.name = "winning-effect";
        node.width = REEL_ITEM_SIZE;
        node.height = REEL_ITEM_SIZE;
        const animation = node.addComponent(SpriteSheetAnimation);
        animation.setAtlas(atlas);
        const item = this.initItem(i);
        const atlasNode = item.getChildByName("atlas-sheet");
        atlasNode.active = true;
        atlasNode.addChild(node);

        const nodeData = { node: atlasNode, path };
        this._nodes[i] = nodeData;

        const selectionItem = item.getComponent(SelectionItem);
        this.pushItem(selectionItem);
      }
      i++;
    }
    this.items[0]?.setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_WINNING_ANIMATION, this._nodes[id]);
  }
}
