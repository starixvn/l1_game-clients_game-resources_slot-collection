import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import SymbolCollectionRow from "./SymbolCollectionRow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollection extends SelectionControl {
  @property
  key = "letter-symbols";

  arrPack = [1, 2, 3, 20, 50, 125];

  private _skeletons = {};

  async initItems() {
    const total = uiManager.PACK_TOTAL;
    const symbolCount = 15;
    for (const i of this.arrPack) {
      const skeletons = [];
      for (let j = 0; j < symbolCount; j++) {
        const path = `${this.key}/pack${i}/symbol-${j}`;
        const skeletonData = await GameUtils.loadResource<sp.SkeletonData>(
          path,
          sp.SkeletonData
        );
        if (skeletonData) {
          skeletons.push(skeletonData);
        }
      }

      if (skeletons.length === 0) {
        break;
      }

      this._skeletons[i] = skeletons;
      const item = this.initItem(i);

      const selectionItem = item.getComponent(SymbolCollectionRow);
      selectionItem.addSymbols(skeletons);
      this.items.push(selectionItem);
    }
    this.items.length && this.items[0].setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_MULTI_SYMBOLS, this._skeletons[id]);
  }
}
