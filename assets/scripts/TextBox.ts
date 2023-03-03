const { ccclass, property } = cc._decorator;

@ccclass
export default class TextBox extends cc.EditBox {
  setString(value: string) {
    this.string = value;
    this.placeholder = value;
    this.textLabel.string = value;
    this.placeholderLabel.string = value;
  }
  editBoxTextChanged(text) {
    //override, do nothing
  }
}
