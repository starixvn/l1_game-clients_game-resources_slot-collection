import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinningAnimationCollection extends SelectionControl {
  private _nodes = [];
  async initItems() {
    const total = uiManager.PACK_TOTAL;
    for (let i = 1; i <= total; i++) {
      const path = `winning-animations/pack${i}/winning-animation`;
      const skeletonData = await GameUtils.loadResource<sp.SkeletonData>(
        path,
        sp.SkeletonData
      );
      if (skeletonData) {
        const item = this.initItem(i);
        const skeleton = item.getComponentInChildren(sp.Skeleton);
        if (skeleton) {
          skeleton.node.active = true;
          skeleton.skeletonData = skeletonData;
          skeleton.setAnimation(0, "win", true);
        }
        this._nodes[i] = skeleton.node;

        const selectionItem = item.getComponent(SelectionItem);
        this.items.push(selectionItem);
      } else {
        const pathPrefab = `winning-animations/pack${i}/AtlasSpriteWinning`;
        const prefabData = await GameUtils.loadResource<cc.Prefab>(
          pathPrefab,
          cc.Prefab
        );
        if (prefabData) {
          const prefabNode = cc.instantiate(prefabData);
          const item = this.initItem(i);
          const atlasNode = item.getChildByName("atlas-sheet");
          atlasNode.active = true;
          atlasNode.addChild(prefabNode);
          this._nodes[i] = atlasNode;

          const selectionItem = item.getComponent(SelectionItem);
          this.items.push(selectionItem);
        }
      }

      this.items[0]?.setSelected(true);
    }
    console.log("winning-animations", this.content.childrenCount);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_WINNING_ANIMATION, this._nodes[id]);
  }
}
