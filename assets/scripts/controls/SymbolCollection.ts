import { Events } from "../manager/Events";
import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import GameUtils from "../utils/GameUtils";
import SymbolCollectionRow from "./SymbolCollectionRow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolCollection extends SelectionControl {
  @property
  key = "symbols";

  private _collectionData = {};
  private selectionItemDict = {};

  async initItems() {
    const allData = cc.resources.getDirWithPath(this.key, sp.SkeletonData);
    let currentIndex: number;
    for (const key of Object.keys(allData)) {
      const data = allData[key];
      const path: string = data.path;
      const temp = path.split("/");
      const packIndex = +temp[1];

      if (currentIndex === undefined || currentIndex !== packIndex) {
        currentIndex = packIndex;
        const item = this.initItem(packIndex);

        const selectionItem = item.getComponent(SymbolCollectionRow);
        this.selectionItemDict[packIndex] = selectionItem;
        this.items.push(selectionItem);
      }

      this._collectionData[packIndex] = this._collectionData[packIndex] || [];
      const skeleton = await GameUtils.loadResource<sp.SkeletonData>(
        path,
        sp.SkeletonData
      );
      if (skeleton) {
        const node = (
          this.selectionItemDict[packIndex] as SymbolCollectionRow
        ).addSymbol(skeleton);
        node.addComponent(cc.Button);
        node.on("click", () => {
          uiManager.emit(Events.UPDATE_ONE_SYMBOL, skeleton);
        });
        this._collectionData[packIndex].push(skeleton);
      }
    }
    this.items.length && this.items[0].setSelected(true);
  }
  emitEventSelected(id: number) {
    uiManager.emit(Events.UPDATE_MULTI_SYMBOLS, this._collectionData[id]);
  }
}
