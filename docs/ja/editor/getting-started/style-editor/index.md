# エディタにスタイルを付ける

> 原文: [https://tiptap.dev/docs/editor/getting-started/style-editor](https://tiptap.dev/docs/editor/getting-started/style-editor)

Tiptap はヘッドレスを前提にしています。つまり、コアの拡張機能にはスタイルも UI コンポーネントもなく、ロジックだけが入っています。そのため、エディタの見た目と振る舞いを完全に制御できます。

一方で、開発を速めるのに使える、任意の UI コンポーネントとテンプレートも提供するようになりました。

### UI テンプレートで始める

UI テンプレートには、エディタのよくある機能を実装した構築済みのコンポーネントが入っています。ソースコードをダウンロードし、必要に合わせてカスタマイズしてください。

[UI コンポーネントを入手する](https://tiptap.dev/docs/ui-components/getting-started/overview)

### 自分で UI を作る

自分で UI を作りたい場合や、Tiptap でのスタイルの仕組みを理解したい場合は、次の方法があります。

## 素の HTML にスタイルを付ける

エディタ全体は、`.tiptap` クラスを持つコンテナの中にレンダリングされます。これを使えば、スタイルの適用範囲をエディタのコンテンツに絞れます。

```css
/* エディタ内だけに適用する */
.tiptap p {
  margin: 1em 0;
}
```

> [!WARNING]
> **CSS Modules でスタイルを付ける場合**
>
> [CSS Modules](https://github.com/css-modules/css-modules) では、スコープを局所化するためにクラス名が書き換えられます。
> そのため、`.tiptap` クラスを対象にしたスタイルが適用されないことがあります。スタイルを確実に適用するには、
> グローバルなスタイルか `:global(.tiptap)` 修飾子を使ってください。

保存したコンテンツを別の場所でレンダリングする場合は `.tiptap` コンテナがないので、該当する HTML タグにグローバルにスタイルを付けます。

```css
/* グローバルなスタイル */
p {
  margin: 1em 0;
}
```

## 独自のクラスを追加する

レンダリング全体を制御でき、あらゆる要素にクラスを追加することもできます。

### 拡張機能

多くの拡張機能では、`HTMLAttributes` オプションで、レンダリングされる HTML に属性を追加できます。これを使って独自のクラス（やほかの属性）を追加できます。[Tailwind CSS](#style-using-tailwind-css) を使うときにもとても役立ちます。

```js
new Editor({
  extensions: [
    Document,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'my-custom-paragraph',
      },
    }),
    Heading.configure({
      HTMLAttributes: {
        class: 'my-custom-heading',
      },
    }),
    Text,
  ],
})
```

レンダリングされる HTML は次のようになります。

```html
<h1 class="my-custom-heading">Example Text</h1>
<p class="my-custom-paragraph">Wow, that's really custom.</p>
```

拡張機能がすでにクラスを定義している場合は、そこに指定したクラスが追加されます。

### エディタ

エディタを含む要素にクラスを渡すこともできます。

```js
new Editor({
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
})
```

## HTML をカスタマイズする

拡張機能のマークアップをカスタマイズすることもできます。次の例では、`<strong>` タグではなく `<b>` タグをレンダリングする独自の太字の拡張機能を作ります。

```js
import Bold from '@tiptap/extension-bold'

const CustomBold = Bold.extend({
  renderHTML({ HTMLAttributes }) {
    // 元のコード:
    // return ['strong', HTMLAttributes, 0]
    return ['b', HTMLAttributes, 0]
  },
})

new Editor({
  extensions: [
    // …
    CustomBold,
  ],
})
```

整理しやすいように独自の拡張機能は別ファイルに置くべきですが、考え方はこれで伝わると思います。

## Tailwind CSS でスタイルを付ける

Tiptap が扱うコンテンツは素の HTML で、デフォルトでは Tailwind CSS のクラスが付いていません。エディタにスタイルを付ける方法はいくつかあります。

### グローバルな CSS ファイルと `@apply` を使う

Tailwind のメンテナーは `@apply` を使わないよう勧めていますが、Tiptap のコンテンツのように、ユーザーが自由に書くコンテンツのスタイルを定義するには、これが最善の方法だと私たちは考えています。
グローバルな CSS ファイルを使い、エディタ内の HTML タグに Tailwind のスタイルを適用できます。ネストしたセレクターが広くサポートされるようになったので、スタイルの範囲を `.tiptap` クラスに絞れます。

```css
.tiptap {
  p {
    @apply my-4 first:mt-0 last:mb-0 text-base leading-relaxed;
  }

  h1 {
    @apply text-3xl font-bold mt-8 mb-4 first:mt-0 last:mb-0;
  }
}
```

### 拡張機能にクラスを追加する

グローバルな CSS ファイルを使いたくない場合は、少し手間がかかりますが、既存のコンポーネントを拡張し、`renderHTML` の出力の `HTMLAttributes` に Tailwind のクラスを追加する方法もあります。

```js
import Paragraph from '@tiptap/extension-paragraph'

const TailwindParagraph = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'p',
      {
        ...HTMLAttributes,
        class: 'my-4 first:mt-0 last:mb-0 text-base leading-relaxed',
      },
      0,
    ]
  },
})
```

この方法でも動きますが、拡張機能が複雑になったり NodeView を使ったりすると扱いが難しくなります。そのため、ほとんどの場合はグローバルな CSS ファイルと `@apply` を使う方法をおすすめします。

### `@tailwindcss/typography` プラグインを使う

エディタは Tailwind CSS ともうまく動きます。`@tailwindcss/typography` プラグインでスタイルを付けた例を下に示します。

[デモを開く](https://embed.tiptap.dev/preview/Experiments/Tailwind?inline=false)

### IntelliSense

[TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) を使っているなら、次のスニペットを `.vscode/settings.json` に追加すると、Tiptap のオブジェクト内でも IntelliSense が効くようになります。

```json
"tailwindCSS.experimental.classRegex": [
  "class:\\s*?[\"'`]([^\"'`]*).*?,"
]
```

## 次のステップ

- [Tiptap の基本概念を詳しく知る](../../core-concepts/introduction.md)
- [エディタの状態を永続化する方法を学ぶ](../../core-concepts/persistence.md)
- [独自の拡張機能を作り始める](../../extensions/custom-extensions/index.md)
