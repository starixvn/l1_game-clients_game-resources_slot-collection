const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectionItem extends cc.Component {
  @property(cc.Node)
  highlightNode: cc.Node = null;

  private _selected: boolean = false;
  public itemId = 0;
  public selectedCallback = (id: number) => {};
  onLoad() {
    this.node.addComponent(cc.Toggle);
    this.node.on("click", this.onSelectionClicked.bind(this));
  }

  protected onSelectionClicked() {
    this._selected = true;
    this._selected && this.selectedCallback(this.itemId);
    this.setHighlight(this._selected);
  }

  setSelected(selected: boolean) {
    this._selected = selected;
    this.setHighlight(selected);
  }

  setHighlight(show: boolean) {
    this.highlightNode.active = show;
  }
}
