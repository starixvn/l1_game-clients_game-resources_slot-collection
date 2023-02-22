import { uiManager } from "../manager/UIManager";
import SelectionControl from "../selection-control/SelectionControl";
import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleSymbolCollection extends SelectionControl {
  async initItems() {
    for (let i = 0; i < 11; i++) {
      const node = this.initItem(i);
      this.items.push(node.getComponent(SelectionItem));
    }
  }

  emitEventSelected(id: number) {
    uiManager.selectedSymbolIndex = id;
    // uiManager.emit(Events.SELECTED_SYMBOL, id);
  }
}
