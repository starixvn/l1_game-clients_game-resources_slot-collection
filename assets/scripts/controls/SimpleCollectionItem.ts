import SelectionItem from "../selection-control/SelectionItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SimpleCollectionItem extends SelectionItem {
  @property(cc.Label)
  nameLabel: cc.Label = null;

  setNameLabel(value: string) {
    this.nameLabel.string = value;
  }
}
