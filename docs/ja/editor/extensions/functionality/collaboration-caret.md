# CollaborationCaret 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/collaboration-caret](https://tiptap.dev/docs/editor/extensions/functionality/collaboration-caret)

この拡張機能は、接続しているすべてのユーザーについて、名前や指定した色などの情報、現在のキャレットの位置、テキストの選択範囲（あれば）を表示します。

共同編集に対応したエディタが前提です。フルホスト型やオンプレミス型の共同編集サーバーについては、[Tiptap Collaboration のドキュメント](https://tiptap.dev/docs/collaboration/getting-started/overview)を参照してください。

> [!WARNING]
> **公開デモ**
>
> このエディタのコンテンツはほかのユーザーと共有されます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/CollaborationCaret?hideSource)
[デモを開く](https://embed.tiptap.dev/preview/Extensions/CollaborationCaret)

試すには、このページを複数のブラウザウィンドウで開いてください。

## インストール

```bash
npm install @tiptap/extension-collaboration-caret
```

この拡張機能には [`Collaboration`](https://tiptap.dev/docs/collaboration/getting-started/overview) 拡張機能が必要です。

## 設定

### provider

Y.js のネットワークプロバイダーです。たとえば [Tiptap Collaboration](https://tiptap.dev/docs/collaboration/getting-started/overview) のインスタンスを指定します。

デフォルト: `null`

### user

現在のユーザーの属性です。名前と色を持つ前提ですが、どんな属性でも使えます。値は、接続しているほかのすべてのクライアントと同期されます。

`color` の値は16進数のカラーコード（`#RRGGBB`）で指定してください。

デフォルト: `{ user: null, color: null }`

### render

キャレットをレンダリングする関数です。例は[拡張機能のソースコード](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-collaboration-caret/)を参照してください。

### selectionRender

選択範囲をレンダリングする関数です。例は[拡張機能のソースコード](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-collaboration-caret/)を参照してください。

## スタイル

この拡張機能にはデフォルトのスタイルが含まれていません。次の CSS がないと、キャレットはスタイルのないインライン要素としてレンダリングされます。

次のスタイルをプロジェクトに追加してください。

```css
/* ほかのユーザーのキャレットを表示する */
.tiptap .collaboration-carets__caret {
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

/* キャレットの上にユーザー名を表示する */
.tiptap .collaboration-carets__label {
  border-radius: 3px 3px 3px 0;
  color: #0d0d0d;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}
```

## コマンド

### updateUser()

現在のユーザーの更新後の属性をオブジェクトで渡します。`name` と `color` を想定していますが、ほかのフィールドを加えてもかまいません。

```js
editor.commands.updateUser({
  name: 'John Doe',
  color: '#000000',
  avatar: 'https://unavatar.io/github/ueberdosis',
})
```

## ソースコード

[packages/extension-collaboration-caret/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-collaboration-caret/)

## Collaboration

シートベルトを締めてください。Tiptap Collaboration で、リッチテキストエディタを共同編集に対応させましょう。

- あらゆるものがリアルタイム
- オフラインファーストで、競合が起きない
- 当社によるマネージドホスティングにも、オンプレミスにも対応

[詳しく見る](https://tiptap.dev/docs/collaboration/getting-started/overview)
