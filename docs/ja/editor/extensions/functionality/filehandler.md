# FileHandler 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/filehandler](https://tiptap.dev/docs/editor/extensions/functionality/filehandler)

エディタにファイルをドラッグ＆ドロップしたり貼り付けたりしたいと思ったことはありませんか。私たちもそう思ったので、そのための拡張機能を用意しました。

`FileHandler` 拡張機能を使うと、エディタへのファイルのドロップと貼り付けを手軽に扱えます。どちらのイベントにも独自のハンドラーを定義でき、許可するファイルの種類も管理できます。

デフォルトでは、ファイルを貼り付けたりドロップしたりしても、この拡張機能はアップロードされたファイルを表示しません。代わりにイベントを発行するので、それに応じてエディタに新しいノードを挿入します。たとえば、アップロードされた画像ファイルを表示するには [Image 拡張機能](../nodes/image.md)を使います。

> [!NOTE]
> **サーバーへのアップロード機能はない**
>
> この拡張機能が担当するのは、エディタにファイルがドロップされたり貼り付けられたりしたときのイベント処理だけです。サーバーへのファイルのアップロードは実装していません。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FileHandler)

## インストール

```bash
npm install @tiptap/extension-file-handler
```

## 設定

### onPaste

エディタにファイルが貼り付けられたときに呼ばれるコールバック関数です。エディタのインスタンスと、貼り付けられたファイルを受け取ります。

デフォルト: `undefined`

```js
FileHandler.configure({
  onPaste: (editor, files, htmlContent) => {
    // ファイルを使って何か処理し、
    // エディタにファイルを挿入する
    // 場合によっては（ほかのアプリからコピー＆ペーストした GIF など）、ファイルを直接使わないほうがよい
    // ファイルのパーサーは GIF の1フレームだけを PNG として受け取るため
    // その場合は htmlContent から URL を取り出して使い、挿入はほかの入力ルールに任せる
    // あるいは、ここに貼り付けられた htmlContent でほかの処理をする
  },
})
```

### onDrop

エディタにファイルがドロップされたときに呼ばれるコールバック関数です。エディタのインスタンス、ドロップされたファイル、ドロップされた位置を受け取ります。

デフォルト: `undefined`

```js
FileHandler.configure({
  onDrop: (editor, files, pos) => {
    // ファイルを使って何か処理し、
    // エディタにファイルを挿入する
  },
})
```

### allowedMimeTypes

エディタにドロップしたり貼り付けたりできるファイルの種類を決めるオプションです。MIME タイプの一覧か、ファイルの拡張子の一覧を指定できます。どちらも指定しない場合は、すべてのファイルを受け付けます。

デフォルト: `undefined`

```js
FileHandler.configure({
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
})
```

### consumePasteEvent

`true` にすると、ファイルが含まれている貼り付けイベントは、クリップボードに HTML のコンテンツが一緒に入っていても、ここで完全に処理を終えます。同じイベントでほかの拡張機能の貼り付けルールが動いて、コンテンツが重複するのを防げます。

`onPaste` コールバックでファイルを挿入しており、同じ貼り付けをほかの拡張機能に処理させたくない場合に使います（たとえば、貼り付けた画像を FileHandler と Image 拡張機能の両方が処理して、画像のノードが重複するのを防ぎたい場合）。

デフォルト: `false`

```js
FileHandler.configure({
  consumePasteEvent: true,
})
```
