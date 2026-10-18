# Emoji 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/emoji](https://tiptap.dev/docs/editor/extensions/nodes/emoji)

`Emoji` 拡張機能は、絵文字をインラインのノードとしてレンダリングします。入力や貼り付けなどで挿入された絵文字は、すべてこのノードに変換されます。こうしておくと、表示に対応していない絵文字を代替画像でレンダリングできます。エディタからテキストをコピーすると、絵文字はプレーンテキストに戻ります。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Emoji)

## インストール

```bash
npm install @tiptap/extension-emoji
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Emoji.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### emojis

使う絵文字のセットを指定します。Tiptap には 2 種類の絵文字リストがあります。

1. デフォルトの `emojis` リスト。Unicode 14.1 の絵文字をすべて含みます
2. 拡張版の `gitHubEmojis` リスト。:octocat: のような独自の絵文字も含みます

```js
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'

Emoji.configure({
  emojis: gitHubEmojis,
})
```

> [!TIP]
> **肌の色**
>
> 肌の色の指定にはまだ対応していません ✌🏽

### enableEmoticons

テキストを絵文字に変換するかどうかを指定します（例: `<3` を ❤️ に）。デフォルトは `false` です。

```js
Emoji.configure({
  enableEmoticons: true,
})
```

### forceFallbackImages

常に代替画像でレンダリングするかどうかを指定します。デフォルトは `false` です。

```js
Emoji.configure({
  forceFallbackImages: true,
})
```

#### 独自の絵文字を追加する

独自の絵文字はとても簡単に追加できます。

```js
import Emoji, { emojis } from '@tiptap/extension-emoji'

const customEmojis = [
  {
    // 絵文字の一意な名前。属性として保存される
    name: 'octocat',
    // 入力ルールが絵文字を探すときに使う、一意なショートコードのリスト
    shortcodes: ['octocat'],
    // 絵文字の検索に役立つタグのリスト
    tags: ['cat', 'meow'],
    // 絵文字のグループ分けに使う名前
    group: 'My custom group of emojis',
    // レンダリングする画像
    fallbackImage: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
]

Emoji.configure({
  emojis: [...emojis, ...customEmojis],
})
```

### suggestion

[詳しく見る](../../api/utilities/suggestion.md)

```js
Emoji.configure({
  suggestion: {
    // …
  },
})
```
