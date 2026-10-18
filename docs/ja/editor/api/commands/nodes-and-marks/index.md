# ノードとマークのコマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/nodes-and-marks](https://tiptap.dev/docs/editor/api/commands/nodes-and-marks)

Tiptap には、ノードとマークを手軽に操作するコマンドがあります。

ノードとマークは、Tiptap エディタを構成する部品です。ノードは段落・見出し・画像といったコンテンツの要素を表し、マークは太字・斜体・リンクといったインラインの書式を表します。

## ユースケース

- **新しいノードの作成:** [`createParagraphNear`](create-paragraph-near.md) や [`splitBlock`](split-block.md) で、選択範囲の近くに新しいノードを追加します。
- **ノード構造の管理:** [`setNode`](set-node.md)、[`lift`](lift.md)、[`toggleNode`](toggle-node.md) などのコマンドで、ノードを更新・置換したり持ち上げたりします。
- **マークの操作:** [`toggleMark`](toggle-mark.md)、[`setMark`](set-mark.md)、[`unsetMark`](unset-mark.md) などのコマンドで、マークを切り替えたり、付けたり外したりします。
- **コンテンツの整理:** [`clearNodes`](clear-nodes.md)、[`unsetAllMarks`](unset-all-marks.md)、[`resetAttributes`](reset-attributes.md) で、不要なマークやノードを取り除きます。

## ノードとマークのコマンド一覧

| コマンド              | 説明                                                                       |
| --------------------- | -------------------------------------------------------------------------- |
| `clearNodes`          | エディタのスキーマに従いつつ、すべてのノードを消去する                     |
| `createParagraphNear` | 現在の選択範囲の近くに新しい段落ノードを作る                               |
| `deleteNode`          | 選択したノードを削除する                                                   |
| `extendMarkRange`     | 現在の選択範囲を、指定したマーク全体を含むように広げる                     |
| `exitCode`            | 現在のコードブロックから抜け、新しいデフォルトのブロックで編集を続ける           |
| `insertDefaultBlock`  | スキーマのデフォルトのブロック型を指定した位置に挿入する                         |
| `joinBackward`        | 現在の選択範囲から、2 つのノードを後方へ結合する                           |
| `joinForward`         | 現在の選択範囲から、2 つのノードを前方へ結合する                           |
| `lift`                | ノードを親ノードへ持ち上げる                                               |
| `liftEmptyBlock`      | 選択中の空のテキストブロックを持ち上げる                                   |
| `newlineInCode`       | 現在のコードブロックに改行を挿入する                                       |
| `resetAttributes`     | ノードの指定した属性をデフォルトに戻す                                         |
| `setMark`             | 現在の選択範囲に新しいマークを追加する                                     |
| `setNode`             | 指定した範囲を、指定したノードで置き換える                                 |
| `splitBlock`          | 現在のノードを、現在の選択範囲の位置で 2 つに分割する                      |
| `toggleMark`          | 現在の選択範囲で、特定のマークのオン・オフを切り替える                     |
| `toggleNode`          | ノードを別のノードと切り替える                                             |
| `toggleWrap`          | 現在のノードを新しいノードで包む。または包んでいるノードを外す             |
| `undoInputRule`       | 直前に発動した入力ルールを元に戻す                                         |
| `unsetAllMarks`       | 現在の選択範囲からすべてのマークを外す                                     |
| `unsetMark`           | 現在の選択範囲から特定のマークを外す                                       |
| `updateAttributes`    | ノードやマークの属性を新しい値にする                                       |
