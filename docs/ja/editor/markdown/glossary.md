# Tiptap の Markdown 用語集

> 原文: [https://tiptap.dev/docs/editor/markdown/glossary](https://tiptap.dev/docs/editor/markdown/glossary)

詳しい説明に入る前に、このガイドで繰り返し使う主な用語をまとめておきます。

## トークン（Token）

パースした Markdown の一部分を表す、普通の JavaScript オブジェクトです。たとえば見出しのトークンは `{ type: "heading", depth: 2, text: "Hello" }` のような形になります。トークンは、ドキュメントの構造を組み立てる「レゴブロック」にあたります。

- トークンは、[MarkedJS](https://marked.js.org) のパーサーが生成する、Markdown 記法の一部分を構造化した表現です。
- どのトークンにも `type`（`heading`、`paragraph`、`list` など）があります。
- トークンには、その種類に応じた追加のプロパティ（見出しの `depth`、リストの `ordered` など）が含まれることがあります。
- `tokens` や `items` などのプロパティに入れ子のトークンを持つこともあり、Markdown コンテンツの階層構造を表します。
- トークンは Tiptap でそのまま使えません。Tiptap の JSON 形式に変換する必要があります。
- トークンは[トークナイザー](#tokenizer)が作ります。
- [カスタムトークナイザー](./advanced-usage/custom-tokenizer)を実装すれば、独自のトークンも作れます。

> **注**: MarkedJS には標準の Markdown 記法用のトークナイザーが組み込まれています。MarkdownManager にカスタムトークナイザーを渡せば、これらを拡張したり置き換えたりできます。
>
> デフォルトのトークンの一覧は [MarkedJS の型定義](https://github.com/markedjs/marked/blob/master/src/Tokens.ts)にあります。

## Tiptap JSON

- Markdown とは関係なく、Tiptap と ProseMirror がドキュメント構造を表すのに使う JSON 形式です。
- Tiptap JSON はノードとマークで構成されます。それぞれ `type` を持ち、必要に応じて `attrs` と、`content` または `text` を持ちます。
- ノードはブロックレベルの要素（段落、見出し、リストなど）を表し、マークはインラインの書式（太字、斜体、リンクなど）を表します。
- Tiptap JSON は階層構造になっていて、ノードの中に別のノードやテキストが入ります。これがドキュメントの構造をそのまま表します。
- **トークン**を使って、エディタが理解できる **Tiptap JSON** を作れます。

トークンと Tiptap JSON の違いがわかったところで、次は、トークンをパースする方法と Tiptap のコンテンツをシリアライズする方法に進みます。

## トークナイザー（Tokenizer）

Markdown の生テキストを走査し、テキストのかたまりをどのようなトークンにするかを決める関数（またはルール）の集まりです。たとえば `## Heading` を見つけると、`heading` トークンを生成します。トークナイザーをカスタマイズしたり上書きしたりすれば、Markdown の解釈のされ方を変えられます。

カスタムトークナイザーの作り方は、[カスタムトークナイザー](./advanced-usage/custom-tokenizer)のガイドで説明しています。

## レキサー（Lexer）

Markdown 文字列全体をたどり、[トークナイザー](#tokenizer)を順に適用して、トークンの完全な一覧を作る取りまとめ役です。入力全体がトークンになるまで、テキストをトークナイザーに繰り返し送り込む機械だと考えてください。

レキサーを直接操作する必要はありません。Tiptap が MarkedJS インスタンスの一部としてレキサーのインスタンスを作り、エディタが存在する間ずっと使い回すからです。

このレキサーのインスタンスは、拡張機能にあるすべての[トークナイザー](#tokenizer)を自動で登録します。
