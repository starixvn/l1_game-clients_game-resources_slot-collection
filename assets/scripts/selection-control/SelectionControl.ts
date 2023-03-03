import SelectionItem from "./SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SelectionControl extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  protected items: SelectionItem[] = [];

  onLoad() {
    this.initItems();
  }

  pushItem(item: SelectionItem) {
    item.selectedCallback = this.onItemSelected.bind(this);
    this.items.push(item);
  }

  onItemSelected(id: number) {
    this.items.forEach((item) => {
      if (item.itemId !== id) {
        item.setSelected(false);
      }
    });

    this.emitEventSelected(id);
  }

  initItem(id: number) {
    const node = cc.instantiate(this.itemPrefab);
    this.content.addChild(node);
    const item = node.getComponent(SelectionItem);
    item.setItemId(id);
    return node;
  }

  abstract initItems();

  abstract emitEventSelected(id: number);
}
