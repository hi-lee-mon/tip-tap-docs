# リストのコマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands/lists](https://tiptap.dev/docs/editor/api/commands/lists)

リストは、Tiptap エディタでコンテンツを構造化するうえで欠かせない要素です。Tiptap には、リストの構造を手軽に操作するコマンドがあります。リストの作成・更新・管理に役立つ基本のコマンドを紹介します。

## ユースケース

- **リストの作成と切り替え:** [`toggleList`](toggle-list.md) で、リストを作ったり種類を切り替えたりします。
- **リスト項目の入れ子と解除:** [`liftListItem`](lift-list-item.md) や [`sinkListItem`](sink-list-item.md) などのコマンドで、リスト項目を持ち上げたり下げたりします。
- **リスト項目の分割と包み込み:** [`splitListItem`](split-list-item.md) と [`wrapInList`](wrap-in-list.md) で、リスト項目を効率よく分割したり包んだりします。
- **リストのキーボード操作の改善:** [`List Keymap`](../../../extensions/functionality/listkeymap.md) 拡張機能を使うと、キーマップのハンドラーが追加され、リストの挙動を細かく調整できます。

## List Keymap 拡張機能

[`List Keymap`](../../../extensions/functionality/listkeymap.md) 拡張機能も合わせて入れるとよいでしょう。リスト上での Backspace と Delete のデフォルトの挙動を変えるキーマップのハンドラーを追加します。たとえば、リスト項目の先頭で Backspace を押すと、その内容が上のリスト項目に持ち上がるようになります。

## リストのコマンド一覧

| コマンド        | 説明                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| `liftListItem`  | 現在の選択範囲を含むリスト項目を、外側の親リストへ持ち上げようとする       |
| `sinkListItem`  | 現在の選択範囲を含むリスト項目を、内側の子リストへ下げる                   |
| `splitListItem` | 1 つのリスト項目を、別々の 2 つのリスト項目に分割する                      |
| `toggleList`    | 異なる種類のリストを切り替える                                             |
| `wrapInList`    | 現在の選択範囲にあるノードをリストで包む                                   |
