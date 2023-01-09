export default class GameUtils {
  public static delayTime(time: number) {
    return new Promise<void>((resolve) => {
      cc.tween({})
        .delay(time)
        .call(() => resolve())
        .start();
    });
  }

  public static showNode(node: cc.Node, transitionTime = 0.3) {
    node.active = true;
    node.opacity = 0;
    cc.tween(node).to(transitionTime, { opacity: 255 }).start();
  }

  public static hideNode2(node: cc.Node, options: any) {
    const duration = options.duration ?? 0.3;
    const onHidden = options.onHidden;
    GameUtils.hideNode(node, duration, onHidden);
  }

  public static hideNode(
    node: cc.Node,
    transitionTime = 0.3,
    onHidden?: () => void
  ) {
    cc.tween(node)
      .to(transitionTime, { opacity: 0 })
      .call(() => {
        onHidden && onHidden();
      })
      .start();
  }
  public static moveToOtherNode(node: cc.Node, destNode: cc.Node) {
    const position = destNode.convertToNodeSpaceAR(
      node.convertToWorldSpaceAR(cc.v3(0, 0, 0))
    );
    node.parent = destNode;
    node.position = position;
  }

  public static loadResource<T>(
    path: string,
    type?: typeof cc.Asset
  ): Promise<T> {
    return new Promise((resolve) => {
      cc.resources.load(path, type, (err, resource: any) => {
        if (err) {
          resolve(null);
          return;
        }
        resolve(resource);
      });
    });
  }
}
