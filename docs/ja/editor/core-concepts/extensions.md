# Tiptap の拡張機能

> 原文: [https://tiptap.dev/docs/editor/core-concepts/extensions](https://tiptap.dev/docs/editor/core-concepts/extensions)

拡張機能は、Tiptap に新しい機能を加えたり、エディタの動作を変えたりする部品です。新しい種類のコンテンツを追加するときも、エディタの見た目を変えるときも、機能を広げるときも、拡張機能を組み合わせて作ります。

エディタに新しい種類のコンテンツを追加するには、[ノード](https://tiptap.dev/docs/editor/api/nodes)と[マーク](../extensions/marks/index.md)を使います。どちらもエディタ内でコンテンツをレンダリングできます。

よく使う拡張機能は、オプションのパッケージ `@tiptap/starter-kit` にまとまっているので、セットアップが簡単になります。詳しくは [`StarterKit`](../extensions/functionality/starterkit.md) を参照してください。

Tiptap コミュニティが作った拡張機能でも、エディタの機能を広げられます。さまざまな独自機能やツールが [Awesome Tiptap Repository](https://github.com/ueberdosis/awesome-tiptap#community-extensions) にあります。コミュニティ製の拡張機能について他の開発者と協力したり助けを求めたりするなら、[Discussion Thread](https://github.com/ueberdosis/tiptap/discussions/2973) に参加してください。

## 主な機能

拡張機能でできるのは、新しい種類のコンテンツの追加だけではありません。次のこともできます。
- ノードやマークに**属性を追加**して、追加のデータを保存する
- 複数の拡張機能に**グローバル属性をまとめて適用**する（テキストの配置や行の高さなどに便利です）
- **コマンドを追加**して、独自のエディタ動作を実行する
- focus、blur、update などの**イベントを監視**する
- 機能をすばやく呼び出せるように**キーボードショートカットを追加**する
- **[デコレーション](decorations.md)を追加**して、ドキュメントを変えずに表示専用のハイライト、注釈、ウィジェットをレンダリングする

## 拡張機能とは

Tiptap は ProseMirror の複雑さをできるだけ隠していますが、土台は ProseMirror の API です。高度な使い方をするなら、[ProseMirror Guide](https://ProseMirror.net/docs/guide/) を一通り読むことをおすすめします。内部の仕組みがよく分かり、Tiptap で使われる多くの用語にも慣れられます。

既存の[ノード](../extensions/nodes/index.md)、[マーク](../extensions/marks/index.md)、[機能](../extensions/functionality/index.md)を見ると、自分の拡張機能をどう作ればよいかがつかめます。ドキュメントとソースコードを行き来しやすいように、各拡張機能のドキュメントページから GitHub 上のファイルにリンクしています。

まずは既存の拡張機能のカスタマイズから始め、そこで得た知識を使って自分の拡張機能を作ることをおすすめします。そのため以下の例はすべて既存の拡張機能を拡張していますが、新しく作った拡張機能でも同じように動きます。

## 新しい拡張機能を作る

Tiptap の拡張機能は自由に作れます。自分の拡張機能を作って登録するのに必要な定型コードは次のとおりです。

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  // ここにコードを書く
})

const editor = new Editor({
  extensions: [
    // 独自の拡張機能をエディタに登録する
    CustomExtension,
    // …ほかの拡張機能も忘れずに登録する
    Document,
    Paragraph,
    Text,
    // …
  ],
})
```

CLI を使えば、新しい拡張機能のひな形を手軽に作れます。

```bash
npm init tiptap-extension
```

独自の拡張機能について詳しくは[ガイド](../extensions/custom-extensions/index.md)を参照してください。
