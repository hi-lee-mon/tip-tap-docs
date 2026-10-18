# 入力ルール

> 原文: [https://tiptap.dev/docs/editor/api/input-rules](https://tiptap.dev/docs/editor/api/input-rules)

入力ルールは、入力中のテキストを自動で変換する Tiptap の強力な機能です。テキスト中の特定のパターンをきっかけに、書式設定のショートカットを作ったり、コンテンツを挿入したり、コマンドを実行したりできます。

## 入力ルールとは

入力ルールは、特定のテキスト入力を監視し、それを自動で別のものに変換するパターンベースのトリガーです。たとえば `**bold**` と入力すると太字に変わり、行頭で `1.` と入力すると番号付きリストになります。Markdown 風のショートカットを実装したり、ユーザー体験を高めたりするのに特に役立ちます。

## Tiptap での入力ルールの仕組み

Tiptap は、リスト・引用・マークなど、標準のショートカットの多くを内部で入力ルールとして実装しています。入力ルールは、ユーザーの入力にマッチする正規表現として定義します。パターンが検出されると、ルールが変換を実行します。変換とは、マークの適用、ノードの挿入、コマンドの実行などです。

入力ルールは通常、拡張機能（ノード、マーク、汎用の拡張機能）の中で `addInputRules()` メソッドを使って登録します。マークやノード向けの入力ルールを簡単に作れるよう、Tiptap は `markInputRule` や `nodeInputRule` といったヘルパー関数を用意しています。

## `markInputRule` と `nodeInputRule` を理解する

Tiptap には、入力ルールを簡単に作るためのヘルパー関数が 2 つあります。

- **`markInputRule`**: パターンに応じてマーク（太字、斜体、ハイライトなど）を適用します。
- **`nodeInputRule`**: パターンに応じてノード（画像、図、カスタムブロックなど）を挿入・変換します。

どちらの関数も設定オブジェクトを受け取ります。設定オブジェクトには少なくとも次のプロパティがあります。

- `find`: 入力パターンにマッチさせる正規表現。
- `type`: 適用・挿入するマークまたはノードの型。
- `getAttributes`（省略可）: 正規表現のマッチ結果から属性を取り出して返す関数。
- `undoable`（省略可）: 入力ルールを元に戻せるかどうか。デフォルトは true。

### `getAttributes` で情報を取り出す

`getAttributes` 関数を使うと、マッチした入力からデータを取り出し、ノードやマークの属性として渡せます。ユーザーの入力から `src`、`alt`、`title` などの値を取り込みたい画像や図のノードで特に便利です。

#### 例: ノードの入力ルールで `getAttributes` を使う

```ts
addInputRules() {
  return [
    nodeInputRule({
      find: /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/, // ![alt](src "title") にマッチする
      type: this.type,
      getAttributes: match => {
        const [, alt, src, title] = match
        return { src, alt, title }
      },
    }),
  ]
},
```

この例では、ユーザーが `![Alt text](image.png "Optional title")` のように入力すると、入力ルールがマッチ結果から `alt`、`src`、`title` を取り出し、ノードの属性として渡します。

#### 例: マークの入力ルールで `getAttributes` を使う

```ts
addInputRules() {
  return [
    markInputRule({
      find: /\*\*([^*]+)\*\*$/, // **bold** にマッチする
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

詳しくは [ProseMirror の入力ルールのドキュメント](https://prosemirror.net/docs/ref/#inputrules.InputRule) を参照してください。
