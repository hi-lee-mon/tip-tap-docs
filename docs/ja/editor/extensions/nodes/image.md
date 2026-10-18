# Image 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/image](https://tiptap.dev/docs/editor/extensions/nodes/image)

`<img>` HTML タグをレンダリングするための拡張機能です。デフォルトでは、画像はブロックになります。テキストと同じ行に画像をレンダリングしたい場合は、`inline` オプションを `true` にします。

> [!NOTE]
> **サーバー側の機能はありません**
>
> この拡張機能が担うのは画像の表示だけです。画像をサーバーにアップロードする機能はありません。
> アップロードが必要なら、[FileHandler 拡張機能](../functionality/filehandler.md)を組み込んでください

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Image)

## インストール

```bash
npm install @tiptap/extension-image
```

## 設定

### inline

画像ノードをインラインでレンダリングします。たとえば段落タグの中に `<p><img src="spacer.gif"></p>` のように入ります。デフォルトでは、画像は段落と同じ階層に置かれます。

どちらがよいかは、どんな編集体験にしたいか次第です。たとえば Quill から Tiptap に移行する場合などに役立ちます。

デフォルト: `false`

```js
Image.configure({
  inline: true,
})
```

### resize

画像をリサイズ可能にするためのオプション。指定すると、ノードは[リサイズ可能なノードビュー](../../api/resizable-nodeviews.md)で包まれ、リサイズハンドルで画像の大きさを変えられるようになります。

デフォルト: `undefined`

```js
Image.configure({
  resize: {
    enabled: true,
    directions: ['top', 'bottom', 'left', 'right'], // 任意の方向や斜めの組み合わせを指定できる
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: true,
  }
})
```

### allowBase64

base64 文字列の画像（`<img src="data:image/jpg;base64...">`）のパースを許可します。

デフォルト: `false`

```js
Image.configure({
  allowBase64: true,
})
```

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Image.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## コマンド

### setImage()

現在のノードを画像にします。

```js
editor.commands.setImage({ src: 'https://example.com/foobar.png' })
editor.commands.setImage({
  src: 'https://example.com/foobar.png',
  alt: 'A boring example image',
  title: 'An example',
})
```

## 例

### リサイズ可能な画像

[デモを開く](https://embed.tiptap.dev/preview/Examples/ResizableImages)

## ソースコード

[packages/extension-image/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-image/)
