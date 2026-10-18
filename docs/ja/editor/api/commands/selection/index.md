# 選択範囲のコマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/selection](https://tiptap.dev/docs/editor/api/commands/selection)

Tiptap エディタには、ドキュメント内の選択範囲とフォーカスを扱うコマンドがあります。カーソルの移動、選択範囲、フォーカスの挙動を管理する基本のコマンドを紹介します。

## ユースケース

- **フォーカスの付け外し:** [`focus`](focus.md) と [`blur`](blur.md) で、フォーカスの挙動を制御します。
- **コンテンツの削除と選択:** [`deleteSelection`](delete-selection.md) や [`selectAll`](select-all.md) などのコマンドで、コンテンツを効率よく扱います。
- **ドキュメント内の移動:** [`scrollIntoView`](scroll-into-view.md) で特定の位置やノードまでスクロールし、[`selectNodeBackward`](select-node-backward.md)、[`selectNodeForward`](select-node-forward.md)、[`selectParentNode`](select-parent-node.md) で特定のノードを選択します。

## 選択範囲のコマンド一覧

| コマンド             | 説明                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `blur`               | エディタからフォーカスを外す                                                                 |
| `deleteRange`        | 範囲内にあるものをすべて削除する                                                             |
| `deleteSelection`    | 現在の選択範囲、またはカーソル位置のものを削除する                                           |
| `enter`              | Enter キーの押下を再現し、新しい行を作る                                                     |
| `focus`              | エディタにフォーカスを戻し、カーソルを指定した位置に移す                                     |
| `keyboardShortcut`   | 指定した名前の ShortcutEvent を発生させる                                                    |
| `scrollIntoView`     | 現在の選択範囲またはカーソル位置までビューをスクロールする                                   |
| `selectAll`          | ドキュメント全体を選択する                                                                   |
| `selectNodeBackward` | カーソルがテキストブロックの先頭にあるとき、現在のテキストブロックの前のノードを選択する     |
| `selectNodeForward`  | カーソルがテキストブロックの末尾にあるとき、現在のテキストブロックの後ろのノードを選択する   |
| `selectParentNode`   | 選択範囲を、選択中のノードの親ノードへ移す                                                   |
| `setNodeSelection`   | 指定した位置に新しい NodeSelection を作る                                                    |
| `setTextSelection`   | テキストの選択範囲を指定した範囲や位置に設定して制御する                                     |
