# エディタのコマンド

> 原文: [https://tiptap.dev/docs/editor/api/commands](https://tiptap.dev/docs/editor/api/commands)

エディタには、コンテンツの追加や変更、選択範囲の変更をプログラムから行うコマンドが大量に用意されています。自分でエディタを作るなら、ぜひ詳しく知っておきたいところです。

## コマンドを実行する

利用できるコマンドは、すべてエディタのインスタンスから呼び出せます。たとえば、ユーザーがボタンをクリックしたときにテキストを太字にするなら、次のように書きます。

```js
editor.commands.setBold()
```

これでも問題なく選択したテキストが太字になりますが、実際には複数のコマンドを 1 回の実行でチェーンしたいことが多いはずです。次は、その仕組みを説明します。

### コマンドをチェーンする

ほとんどのコマンドは、1 回の呼び出しにまとめられます。多くの場合、関数を別々に呼ぶより短く書けます。選択したテキストを太字にする例です。

```js
editor.chain().focus().toggleBold().run()
```

新しいチェーンを始めるには `.chain()` が必要です。間に並べたコマンドを実際に実行するには `.run()` が必要です。

上の例では、2 つのコマンドを一度に実行しています。ユーザーがコンテンツの外にあるボタンをクリックすると、エディタからフォーカスが外れます。そのため、たいていのコマンドには `.focus()` を付けておくとよいでしょう。エディタにフォーカスが戻り、ユーザーはそのまま入力を続けられます。

チェーンしたコマンドは、いわば順番待ちの列に並び、1 つのトランザクションにまとめられます。つまり、コンテンツの更新は 1 回だけで、`update` イベントも 1 回しか発生しません。

たとえば、**delete** コマンドと **insert** コマンドをチェーンしたいとします。

```js
addCommands() {
  return {
    delete: () => ({ tr }) => {
      tr.delete(tr.selection.from, tr.selection.to)

      return true
    },
    insert: (content: string) => ({ tr }) => {
      tr.insertText(content, tr.selection.from)

      return true
    },
  }
}
```

これで、2 つのコマンドをチェーンできます。

```js
editor.chain().delete().insert('foo').run()
```

#### カスタムコマンドの中でチェーンする

コマンドをチェーンしている間、トランザクションは適用されずに保留されます。カスタムコマンドの中でコマンドをチェーンしたいときは、そのトランザクションを使って処理を追加する必要があります。書き方は次のとおりです。

```js
addCommands() {
  return {
    customCommand: attributes => ({ chain }) => {
      // 動かない:
      // return editor.chain() …

      // 動く:
      return chain()
        .insertContent('foo!')
        .insertContent('bar!')
        .run()
    },
  }
}
```

### インラインのコマンド

コマンドにもう少しロジックを入れたい場面もあります。そこで、コマンドの中でコマンドを実行できるようになっています。とんでもない話に聞こえるかもしれませんが、例を見てみましょう。

```js
editor
  .chain()
  .focus()
  .command(({ tr }) => {
    // トランザクションを操作する
    tr.insertText('hey, that’s cool!')

    return true
  })
  .run()
```

### コマンドを試しに実行する

コマンドを実際には実行せず、実行できるかどうかだけを知りたいこともあります。たとえば、メニューのボタンを表示するか隠すかを決めるときです。そのために `.can()` を用意しました。このメソッドの後に続く処理は実行されますが、変更はドキュメントに適用されません。

```js
editor.can().toggleBold()
```

`.chain()` と組み合わせることもできます。すべてのコマンドを適用できるかを確かめる例です。

```js
editor.can().chain().toggleBold().toggleItalic().run()
```

どちらの呼び出しも、コマンドを適用できる場合は `true`、できない場合は `false` を返します。

カスタムコマンドでもこれが機能するように、必ず `true` か `false` を返してください。

自作のコマンドの中には、生の[トランザクション](../../core-concepts/introduction.md)を扱いたいものもあるでしょう。その場合に `.can()` で正しく動かすには、トランザクションをディスパッチすべきかどうかを確認します。簡単な `.insertText()` コマンドの作り方は次のとおりです。

```js
export default (value) =>
  ({ tr, dispatch }) => {
    if (dispatch) {
      tr.insertText(value)
    }

    return true
  }
```

別の Tiptap コマンドを包むだけなら、この確認は不要です。Tiptap が代わりに行います。

```js
addCommands() {
  return {
    bold: () => ({ commands }) => {
      return commands.toggleMark('bold')
    },
  }
}
```

素の ProseMirror コマンドを包むだけの場合は、いずれにせよ `dispatch` を渡す必要があります。そのため、こちらも確認は不要です。

```js
import { exitCode } from '@tiptap/pm/commands'

export default () =>
  ({ state, dispatch }) => {
    return exitCode(state, dispatch)
  }
```

### コマンドを順に試す

複数のコマンドを並べ、最初に成功したものだけを適用したいときは、`.first()` メソッドを使います。このメソッドはコマンドを 1 つずつ実行し、最初に `true` を返したところで止まります。

たとえば Backspace キーは、まず入力ルールを元に戻そうとします。それが成功すれば、そこで終わりです。入力ルールが適用されておらず元に戻せない場合は、次のコマンドを実行し、選択範囲があればそれを削除します。簡略化した例を示します。

```js
editor.commands.first(({ commands }) => [
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
  // …
])
```

コマンドの中でも同じことができます。

```js
export default () =>
  ({ commands }) => {
    return commands.first([
      () => commands.undoInputRule(),
      () => commands.deleteSelection(),
      // …
    ])
  }
```

## コマンド一覧

コアのコマンドを以下にまとめました。何ができるのか、ひととおりつかめるはずです。

### コンテンツ

| コマンド            | 説明                                                     |
| ------------------- | -------------------------------------------------------- |
| `clearContent()`    | ドキュメント全体を消去する                               |
| `insertContent()`   | 現在の位置にノードまたは HTML 文字列を挿入する           |
| `insertContentAt()` | 指定した位置にノードまたは HTML 文字列を挿入する         |
| `setContent()`      | ドキュメント全体を新しいコンテンツに置き換える           |

### ノードとマーク

| コマンド                | 説明                                                      |
| ----------------------- | --------------------------------------------------------- |
| `clearNodes()`          | ノードを単純な段落に正規化する                            |
| `createParagraphNear()` | 近くに段落を作る                                          |
| `deleteNode()`          | ノードを削除する                                          |
| `extendMarkRange()`     | テキストの選択範囲を現在のマーク全体に広げる              |
| `exitCode()`            | コードブロックから抜ける                                  |
| `insertDefaultBlock()`  | 指定した位置にデフォルトのブロック型を挿入する                  |
| `joinBackward()`        | 2 つのノードを後方へ結合する                              |
| `joinForward()`         | 2 つのノードを前方へ結合する                              |
| `lift()`                | 既存の包みを外す                                          |
| `liftEmptyBlock()`      | 空のブロックを持ち上げる                                  |
| `newlineInCode()`       | コード内に改行文字を追加する                              |
| `resetAttributes()`     | ノードやマークの属性の一部をデフォルトに戻す                  |
| `setMark()`             | 新しい属性でマークを追加する                              |
| `setNode()`             | 指定した範囲をノードで置き換える                          |
| `splitBlock()`          | 既存のノードから新しいノードを分岐させる                  |
| `toggleMark()`          | マークのオン・オフを切り替える                            |
| `toggleNode()`          | ノードを別のノードと切り替える                            |
| `toggleWrap()`          | ノードを別のノードで包む。すでに包まれていれば外す        |
| `undoInputRule()`       | 入力ルールを元に戻す                                      |
| `unsetAllMarks()`       | 現在の選択範囲にあるマークをすべて外す                    |
| `unsetMark()`           | 現在の選択範囲にあるマークを外す                          |
| `updateAttributes()`    | ノードやマークの属性を更新する                            |

### リスト

| コマンド          | 説明                                        |
| ----------------- | ------------------------------------------- |
| `liftListItem()`  | リスト項目を外側のリストへ持ち上げる        |
| `sinkListItem()`  | リスト項目を内側のリストへ下げる            |
| `splitListItem()` | 1 つのリスト項目を 2 つに分割する           |
| `toggleList()`    | 異なる種類のリストを切り替える              |
| `wrapInList()`    | ノードをリストで包む                        |

### 選択範囲

| コマンド               | 説明                                    |
| ---------------------- | --------------------------------------- |
| `blur()`               | エディタからフォーカスを外す            |
| `deleteRange()`        | 指定した範囲を削除する                  |
| `deleteSelection()`    | 選択範囲があれば削除する                |
| `enter()`              | Enter を発生させる                      |
| `focus()`              | 指定した位置でエディタにフォーカスする  |
| `keyboardShortcut()`   | キーボードショートカットを発生させる    |
| `scrollIntoView()`     | 選択範囲が見えるようにスクロールする    |
| `selectAll()`          | ドキュメント全体を選択する              |
| `selectNodeBackward()` | 後方のノードを選択する                  |
| `selectNodeForward()`  | 前方のノードを選択する                  |
| `selectParentNode()`   | 親ノードを選択する                      |
| `setNodeSelection()`   | NodeSelection を作る                    |
| `setTextSelection()`   | TextSelection を作る                    |

## 独自のコマンドを書く

どの拡張機能もコマンドを追加でき、実際ほとんどの拡張機能が追加しています。詳しくは、[ノード](../../extensions/nodes/index.md)、[マーク](../../extensions/marks/index.md)、[機能](../../extensions/functionality/index.md)それぞれのドキュメントを参照してください。もちろん、カスタムコマンドを持つ[独自の拡張機能を追加する](../../extensions/custom-extensions/index.md)こともできます。
では、そうしたコマンドはどう書けばよいのでしょうか。それには少し知っておくべきことがあります。
