# Tiptap で使う Markdown 入門

> 原文: [https://tiptap.dev/docs/editor/markdown](https://tiptap.dev/docs/editor/markdown)

> **重要**: Markdown 拡張機能は早期リリース版です。今後仕様が変わる可能性があり、まだ対応していないエッジケースもあります。バグを見つけたときや機能の要望があるときは、GitHub で issue を作成してください。

Markdown 拡張機能は、Tiptap エディタで Markdown を双方向に扱えるようにします。Markdown 文字列をパースして Tiptap の JSON 形式に変換し、エディタのコンテンツを Markdown にシリアライズして戻せます。

[デモを開く](https://embed.tiptap.dev/preview/Markdown/Full)

## 主な機能

- **Markdown のパース**: Markdown 文字列を Tiptap JSON に変換する
- **Markdown のシリアライズ**: エディタのコンテンツを Markdown として書き出す
- **カスタムトークナイザー**: 独自の Markdown 記法に対応させる
- **拡張しやすい設計**: 拡張機能ごとに、パースとレンダリングの処理を定義できる
- **独自記法を作りやすくするユーティリティ**: `createBlockMarkdownSpec`、`createInlineMarkdownSpec` など
- **HTML への対応**: Markdown に埋め込まれた HTML を、Tiptap の既存の HTML パース処理でパースする

## 仕組み

Markdown 拡張機能は、Markdown テキストと Tiptap の JSON ドキュメント構造の橋渡しをします。

エディタの既存のメソッドやプロパティを Markdown 対応の実装で上書きして、基本機能を拡張します。これにより、Markdown と Tiptap のリッチテキストエディタを違和感なく組み合わせられます。

```js
// 初期コンテンツを設定する
const editor = new Editor({
  extensions: [StarterKit, Markdown],
  content: '# Hello World\n\nThis is **Markdown**!',
  contentType: 'markdown',
})

// コンテンツを挿入する
editor.commands.insertContent('# Hello World\n\nThis is **Markdown**!')
```

### 構成

```
Markdown String
      ↓
   MarkedJS Lexer (Tokenization)
      ↓
   Markdown Tokens
      ↓
   Extension Parse Handlers
      ↓
   Tiptap JSON
```

逆方向は次のとおりです。

```
Tiptap JSON
      ↓
   Extension Render Handlers
      ↓
   Markdown String
```

## 制限事項

現在の Markdown 拡張機能には、次の制限があります。

- **コメントにはまだ対応していません**: コメントのような高度な機能の一部は、Markdown で表現できません。コメントを含むドキュメントに Markdown コンテンツをパースして入れるときは**注意**してください。Markdown コンテンツで置き換えられた部分のコメントは失われることがあります。
- **表のセル内に複数の子ノードは置けません**: Markdown の表には対応していますが、Markdown の記法では複数の子ノードを表現できないため、1つのセルに置ける子ノードは1つだけです。

## なぜ MarkedJS なのか

この拡張機能は、パーサーとして [MarkedJS](https://marked.js.org) を組み込んでいます。

- **高速で軽量**: 現在使える Markdown パーサーの中でも特に高速な部類です
- **拡張しやすい**: カスタムトークナイザーで、標準外の Markdown 記法を扱えます
- **CommonMark に準拠**: CommonMark の仕様に従っています
- **実績がある**: 本番環境で広く使われていて、開発も活発です

Lexer API は Markdown をトークンに分解します。このトークンが Tiptap のノード構造に素直に対応するので、組み込みの実装がすっきりして保守しやすくなります。拡張機能は、ブラウザでもサーバーでも同じように動きます。
