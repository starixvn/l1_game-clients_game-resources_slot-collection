import TextBox from "./TextBox";

const { ccclass, property } = cc._decorator;

interface ExportData {
  symbol_spines: any;
  symbol_images: any;

  winning_effect: string;
  spin_button: string;
  pay_line: string;
  audio: string;
}

@ccclass
export default class Exporter extends cc.Component {
  @property(TextBox)
  outputTextBox: TextBox = null;

  exportData: ExportData;

  readonly storageKey = "exportData";

  onLoad() {
    this.loadStorage();
  }

  updateData() {
    this.updateTextBox();
    this.saveStorage();
  }

  updateTextBox() {
    const text = JSON.stringify(this.exportData, null, 4);
    this.outputTextBox.setString(text);
  }

  loadStorage() {
    const storage = cc.sys.localStorage.getItem(this.storageKey);
    if (storage) {
      this.exportData = JSON.parse(storage);
    } else {
      this.exportData = {
        symbol_spines: {},
        symbol_images: {},
        winning_effect: "",
        spin_button: "",
        pay_line: "",
        audio: "",
      };
    }

    this.updateTextBox();
  }

  saveStorage() {
    const text = JSON.stringify(this.exportData, null, 4);
    cc.sys.localStorage.setItem(this.storageKey, text);
  }

  copyToClipboard() {
    const text = this.outputTextBox.string;
    navigator.clipboard.writeText(text);
  }
}
