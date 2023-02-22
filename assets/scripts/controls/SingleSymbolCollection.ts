import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SingleSymbolItem from "./SingleSymbolItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleSymbolCollection extends SelectionControl {
  async initItems() {
    for (let i = 0; i < 11; i++) {
      const node = this.initItem(i);
      const item = node.getComponent(SingleSymbolItem);
      item.reelItem.setItem(i);
      this.items.push(item);
    }
  }

  emitEventSelected(id: number) {
    uiManager.selectedSymbolIndex = id;
    // uiManager.emit(Events.SELECTED_SYMBOL, id);
  }

  reloadItems() {
    this.items.forEach((item: SingleSymbolItem) => item.reelItem.reloadItem());
  }
}
