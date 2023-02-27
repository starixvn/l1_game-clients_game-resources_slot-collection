const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteSheetAnimation extends cc.Component {
  @property(cc.SpriteAtlas)
  spriteAtlas: cc.SpriteAtlas = null;

  @property
  frameNumber = 0;

  @property
  duration = 1;

  @property
  prefixNameAtlas = "";

  @property
  isLoop = true;

  @property
  padStart = 2;

  private readonly fps = 15;
  private sprite: cc.Sprite;

  initSpriteNode() {
    const nodeName = "Sprite";
    if (this.node.getChildByName(nodeName)) {
      this.sprite = this.node.getChildByName(nodeName).getComponent(cc.Sprite);
      return;
    }

    const spriteNode = new cc.Node();
    spriteNode.name = nodeName;
    this.node.addChild(spriteNode);
    const sprite = spriteNode.addComponent(cc.Sprite);
    sprite.type = cc.Sprite.Type.SIMPLE;
    sprite.trim = false;
    sprite.sizeMode = cc.Sprite.SizeMode.RAW;
    sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
    sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;

    this.sprite = sprite;
  }
  initAnimation() {
    this.initSpriteNode();
    const sprite = this.sprite;

    let index = 0;
    const frames = this.spriteAtlas.getSpriteFrames().sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    this.schedule(
      () => {
        if (index === this.frameNumber) {
          index = 0;
          if (!this.isLoop) {
            this.node.destroy();
          }
        }
        sprite.spriteFrame = frames[index];
        index++;
      },
      1 / this.fps,
      cc.macro.REPEAT_FOREVER,
      0
    );
  }

  setAtlas(atlas: cc.SpriteAtlas) {
    this.spriteAtlas = atlas;

    const frames = atlas.getSpriteFrames();
    this.frameNumber = frames.length;
    this.duration = this.frameNumber / this.fps;
  }

  start() {
    this.initAnimation();
  }
}
