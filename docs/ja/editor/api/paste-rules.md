# 貼り付けルール

> 原文: [https://tiptap.dev/docs/editor/api/paste-rules](https://tiptap.dev/docs/editor/api/paste-rules)

貼り付けルールは、エディタに貼り付けたコンテンツを自動で変換する Tiptap の強力な機能です。貼り付けたテキスト中の特定のパターンをきっかけに、書式設定のショートカットを作ったり、コンテンツを挿入したり、コマンドを実行したりできます。

## 貼り付けルールとは

貼り付けルールは、エディタに貼り付けられた特定のテキストやコンテンツを監視し、それを自動で別のものに変換するパターンベースのトリガーです。たとえば `**bold**` を貼り付けると太字に変わり、画像の URL を貼り付けると画像ノードになります。Markdown 風のショートカットを実装したり、外部からコンテンツを貼り付けるときのユーザー体験を高めたりするのに特に役立ちます。

## Tiptap での貼り付けルールの仕組み

Tiptap は、貼り付けたコンテンツに対する標準のショートカットや動作の多くを、貼り付けルールで実現しています。貼り付けルールは、貼り付けたテキストにマッチする正規表現または独自のマッチャーとして定義します。パターンが検出されると、ルールが変換を実行します。変換とは、マークの適用、ノードの挿入、コマンドの実行などです。

貼り付けルールは通常、拡張機能（ノード、マーク、汎用の拡張機能）の中で `addPasteRules()` メソッドを使って登録します。マークやノード向けの貼り付けルールを簡単に作れるよう、Tiptap は `markPasteRule` や `nodePasteRule` といったヘルパー関数を用意しています。

## 拡張機能に貼り付けルールを作る

独自の貼り付けルールを追加するには、拡張機能に `addPasteRules()` メソッドを定義します。このメソッドは貼り付けルールの配列を返します。

### 例: 貼り付けルール付きのハイライトマークを作る

```ts
import { Mark, markPasteRule } from '@tiptap/core'

const HighlightMark = Mark.create({
  name: 'highlight',

  addPasteRules() {
    return [
      markPasteRule({
        find: /(?:==)((?:[^=]+))(?:==)/g, // ==highlight== にマッチする
        type: this.type,
      }),
    ]
  },
})
```

### 例: 貼り付けルール付きのカスタム figure ノードを作る

```ts
import { Node, nodePasteRule } from '@tiptap/core'

const FigureNode = Node.create({
  name: 'figure',

  addPasteRules() {
    return [
      nodePasteRule({
        find: /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, // ![alt](src "title") にマッチする
        type: this.type,
        getAttributes: match => {
          const [, alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },
})
```

## `markPasteRule` と `nodePasteRule` を理解する

Tiptap には、貼り付けルールを簡単に作るためのヘルパー関数が 2 つあります。

- **`markPasteRule`**: 貼り付けたコンテンツのパターンに応じて、マーク（太字、斜体、ハイライトなど）を適用します。
- **`nodePasteRule`**: 貼り付けたコンテンツのパターンに応じて、ノード（画像、図、カスタムブロックなど）を挿入・変換します。

どちらの関数も設定オブジェクトを受け取ります。設定オブジェクトには少なくとも次のプロパティがあります。

- `find`: 貼り付けたパターンにマッチさせる正規表現、またはマッチャー関数。
- `type`: 適用・挿入するマークまたはノードの型。
- `getAttributes`（省略可）: 正規表現のマッチ結果から属性を取り出して返す関数。
- `getContent`（`nodePasteRule` のみ、省略可）: ノードのコンテンツを返す関数、またはコンテンツの値。

### `getAttributes` で情報を取り出す

`getAttributes` 関数を使うと、マッチした入力からデータを取り出し、ノードやマークの属性として渡せます。貼り付けたコンテンツから `src`、`alt`、`title` などの値を取り込みたい画像や図のノードで特に便利です。

#### 例: ノードの貼り付けルールで `getAttributes` を使う

```ts
addPasteRules() {
  return [
    nodePasteRule({
      find: /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, // ![alt](src "title") にマッチする
      type: this.type,
      getAttributes: match => {
        const [, alt, src, title] = match
        return { src, alt, title }
      },
    }),
  ]
},
```

この例では、ユーザーが `![Alt text](image.png "Optional title")` のようなテキストを貼り付けると、貼り付けルールがマッチ結果から `alt`、`src`、`title` を取り出し、ノードの属性として渡します。

#### 例: マークの貼り付けルールで `getAttributes` を使う

```ts
addPasteRules() {
  return [
    markPasteRule({
      find: /\*\*([^*]+)\*\*/g, // **bold** にマッチする
      type: this.type,
      getAttributes: match => {
        // 必要ならここで独自の属性を取り出せる
        return {}
      },
    }),
  ]
},
```

### ヒント

- `getAttributes` の引数 `match` は正規表現の実行結果です。分割代入すればキャプチャグループを取り出せます。
- `getAttributes` では、ノードやマークが対応している属性なら何でも設定できます。リンクの `href`、画像の `src`、独自のデータ用フィールドなどです。
- 属性を取り出す必要がなければ、`getAttributes` は省略できます。
- 貼り付けたコンテンツ中のすべての出現箇所にマッチさせるには、正規表現に `g`（global）フラグを付けます。
