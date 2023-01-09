import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SelectionItem from "../selection-control/SelectionItem";
import GameUtils from "../utils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinningAnimationCollection extends SelectionControl {
  private _skeletons = {};
  async initItems() {
    const total = uiManager.PACK_TOTAL;
    for (let i = 1; i <= total; i++) {
      const path = `winning-animations/pack${i}/winning-animation`;
      const skeletonData = await GameUtils.loadResource<sp.SkeletonData>(path);
      if (skeletonData) {
        console.log("ske data", i);
        const item = this.initItem(i);
        const skeleton = item.getComponentInChildren(sp.Skeleton);
        if (skeleton) {
          skeleton.skeletonData = skeletonData;
          skeleton.setAnimation(0, "win", true);
        }
        this._skeletons[i] = skeletonData;

        const selectionItem = item.getComponent(SelectionItem);
        this.items.push(selectionItem);
      }

      this.items[0]?.setSelected(true);
    }
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_WINNING_ANIMATION, this._skeletons[id]);
  }
}
