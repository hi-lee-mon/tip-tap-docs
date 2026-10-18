# Mention 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/mention](https://tiptap.dev/docs/editor/extensions/nodes/mention)

正直なところ、mention ノードはすばらしい出来です。ユーザーに通知を送るといった用途の `@mentions` を使えるようにしたうえで、レンダリングを完全に制御できます。

文字どおり、すべてをカスタマイズできます。レンダリング用にカスタムコンポーネントを渡すこともできます。例ではどれも `.filter()` で項目を検索していますが、API に非同期でクエリを送ったり、[fuse.js](https://fusejs.io/) のような高機能なライブラリをプロジェクトに加えたりしてもかまいません。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Mention)

## インストール

```bash
npm install @tiptap/extension-mention
```

## 依存関係

2.0.0-beta.193 から、`@tiptap/suggestion` は peer dependency になりました。そのため、手動でインストールする必要があります。

```bash
npm install @tiptap/suggestion
```

## 設定

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Mention.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### renderText

メンションのテキストをどうレンダリングするかを定義します。

```js
Mention.configure({
  renderText({ options, node }) {
    return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
  },
})
```

### renderHTML

メンションの HTML 要素をどうレンダリングするかを定義します。`span` 以外の要素（たとえば `a`）でレンダリングしたいときに便利です。

```js
Mention.configure({
  renderHTML({ options, node }) {
    return [
      'a',
      mergeAttributes({ href: '/profile/1' }, options.HTMLAttributes),
      `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
    ]
  },
})
```

### deleteTriggerWithBackspace

mention ノードを削除するときに、候補表示のきっかけになる文字も一緒に削除するかどうかを切り替えます。デフォルトは `false` です。

```js
Mention.configure({
  deleteTriggerWithBackspace: true,
})
```

### suggestion

Suggestion ユーティリティのオプションです。候補のポップアップをどの文字で表示するかなどを定義します。[詳しく見る](../../api/utilities/suggestion.md)

```js
Mention.configure({
  suggestion: {
    // …
  },
})
```

### suggestions

1 つのエディタで複数の種類のメンションを定義できます。たとえば、人のメンションは `@`、映画のメンションは `#` で呼び出すように定義できます。[Suggestion ユーティリティについて詳しく見る](../../api/utilities/suggestion.md)

```js
Mention.configure({
  suggestions: [
    {
      char: '@',
      // Suggestion ユーティリティのほかのオプション
    },
    {
      char: '#',
      // Suggestion ユーティリティのほかのオプション
    },
  ],
})
```

デモの例は次のとおりです。

[デモを開く](https://embed.tiptap.dev/preview/Examples/MultiMention)

## 共同編集

Tiptap Collaboration を使っていると、誰かがメンションを入力したときに、ほかのユーザーの画面で候補が「勝手に開く」ことがあります。これを防ぐには、`shouldShow` オプションを設定します。

```js
import { Mention } from '@tiptap/extension-mention'
import { isChangeOrigin } from '@tiptap/extension-collaboration'

const Editor = new Editor({
  extensions: [
    Mention.configure({
      suggestion: {
        shouldShow: ({ transaction }) => isChangeOrigin(transaction),
      },
    }),
  ],
})
```

こうすると、候補メニューが開くのは、きっかけの文字を実際に入力したユーザーの画面だけになります。

## Vanilla JavaScript で使う

候補リスト付きのメンションを設定する完全な例です。

```js
import { Editor } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'

new Editor({
  element: document.querySelector('#editor'),
  extensions: [
    StarterKit,
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: {
        char: '@',
        items: ({ query }) => {
          return ['Alice', 'Bob', 'Carol'].filter((name) =>
            name.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let popup

          return {
            onStart: (props) => {
              popup = document.createElement('div')
              popup.classList.add('suggestion-popup')
              props.items.forEach((item) => {
                const button = document.createElement('button')
                button.textContent = item
                button.addEventListener('click', () => props.command({ id: item }))
                popup.appendChild(button)
              })
              document.body.appendChild(popup)
            },
            onUpdate: (props) => {
              popup.innerHTML = ''
              props.items.forEach((item) => {
                const button = document.createElement('button')
                button.textContent = item
                button.addEventListener('click', () => props.command({ id: item }))
                popup.appendChild(button)
              })
            },
            onExit: () => {
              popup?.remove()
            },
          }
        },
      },
    }),
  ],
  content: '<p>Type @ to mention someone.</p>',
})
```

レンダリング用に、React や Vue のカスタムコンポーネントを渡すこともできます。詳しくは [Suggestion ユーティリティ](../../api/utilities/suggestion.md)を参照してください。

## ソースコード

[packages/extension-mention/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-mention/)
