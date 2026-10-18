# Tiptap の基本概念

> 原文: [https://tiptap.dev/docs/editor/core-concepts/introduction](https://tiptap.dev/docs/editor/core-concepts/introduction)

## 構造

ProseMirror は厳密な[スキーマ](schema.md)に従って動きます。スキーマは、ドキュメントに許される構造を定めるものです。ドキュメントは見出しや段落などの要素でできた木構造で、それぞれの要素をノードと呼びます。ノードにはマークを付けられます。たとえば一部を強調するときに使います。ドキュメントをプログラムから変更するのが[コマンド](../api/commands/index.md)です。

## 状態

ドキュメントは状態（state）の中に保存されます。変更は、トランザクションとして状態に適用されます。状態には、現在のコンテンツ、カーソル位置、選択範囲の情報が入っています。[イベント](../api/events.md)にフックすれば、たとえば適用前のトランザクションを書き換えられます。

## コンテンツ

ドキュメントは内部では [ProseMirror のノード](https://prosemirror.net/docs/ref/#model.Node)として保存されています。`editor.getJSON()` を呼ぶと、Tiptap JSON オブジェクトとして取り出せます。

ドキュメントを保存したり扱ったりするときは、Tiptap JSON 形式を推奨します。Tiptap JSON ドキュメントの例を示します。

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "center"
      },
      "content": [
        { "type": "text", "text": "Hello, " },
        {
          "type": "text",
          "text": "world",
          "marks": [{ "type": "bold" }, { "type": "italic" }]
        },
        { "type": "text", "text": "!" }
      ]
    }
  ]
}
```

Tiptap JSON ドキュメントはノードの木構造です。子を持てるノードもありますが、テキストを入れられるのはテキストノード（`type: 'text'` のノード）だけです。テキストノードやその他のインラインノードにはマークを適用できます。属性を持つノードやマークもあります。

正しい Tiptap JSON コンテンツを定義した JSON Schema は [`/assets/schemas/tiptap-json-schema.json`](https://tiptap.dev/docs/assets/schemas/tiptap-json-schema.json) にあります。保存や処理の前に Tiptap JSON を検証するのに使えます。

## 拡張機能

拡張機能は、エディタに[ノード](../extensions/nodes/index.md)、[マーク](../extensions/marks/index.md)、[機能](../extensions/functionality/index.md)を追加します。多くの拡張機能は、自分のコマンドを一般的な[キーボードショートカット](keyboard-shortcuts.md)に割り当てています。

## 用語

ProseMirror には独自の用語があり、ドキュメントを読んでいるとたびたび目にします。このドキュメントでよく使う用語を簡単にまとめます。

| 用語        | 説明                                                              |
| ----------- | ------------------------------------------------------------------------ |
| Schema（スキーマ）      | コンテンツが取れる構造を設定する                          |
| Document（ドキュメント）    | エディタ内の実際のコンテンツ                                       |
| State（状態）       | エディタの現在のコンテンツと選択範囲を表すすべての情報 |
| Transaction（トランザクション） | 状態への変更（選択範囲やコンテンツの更新など）                    |
| Extension（拡張機能）   | 新しい機能を登録する                                             |
| Node（ノード）        | コンテンツの種類。見出しや段落など                 |
| Mark（マーク）        | ノードに適用できるもの。インラインの書式設定などに使う              |
| Command（コマンド）     | エディタ内で、何らかの形で状態を変える操作を実行する     |
| Decoration（デコレーション）  | ドキュメントの上に重ねるスタイル。誤りのハイライトなどに使う       |
