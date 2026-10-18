# Audio 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/audio](https://tiptap.dev/docs/editor/extensions/nodes/audio)

エディタでネイティブの `<audio>` 要素を使えるようにする拡張機能です。音声ファイルをドキュメントに直接埋め込めます。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Audio)

## インストール

```bash
npm install @tiptap/extension-audio
```

## 設定

### addPasteHandler

音声ソースの貼り付けハンドラーを追加するかどうか。

デフォルト: `true`

```js
Audio.configure({
  addPasteHandler: false,
})
```

### autoplay

音声を自動再生するかどうか。

デフォルト: `false`

```js
Audio.configure({
  autoplay: true,
})
```

### controls

audio 要素にネイティブのコントロールを表示するかどうか。

デフォルト: `true`

```js
Audio.configure({
  controls: false,
})
```

### loop

音声をループ再生するかどうか。

デフォルト: `false`

```js
Audio.configure({
  loop: true,
})
```

### muted

音声をミュートするかどうか。

デフォルト: `false`

```js
Audio.configure({
  muted: true,
})
```

### preload

audio 要素の事前読み込みの挙動。

デフォルト: `'metadata'`

```js
Audio.configure({
  preload: 'none',
})
```

### controlslist

audio 要素の controlslist 属性を指定します。

デフォルト: `undefined`

```js
Audio.configure({
  controlslist: 'nodownload',
})
```

### crossorigin

audio 要素の crossorigin 属性を設定します。

デフォルト: `undefined`

```js
Audio.configure({
  crossorigin: 'anonymous',
})
```

### disableRemotePlayback

audio 要素でリモート再生を無効にするかどうか。

デフォルト: `false`

```js
Audio.configure({
  disableRemotePlayback: true,
})
```

### allowBase64

音声ソースに data: URL を許可します。

デフォルト: `false`

```js
Audio.configure({
  allowBase64: true,
})
```

### HTMLAttributes

レンダリングする HTML タグに追加するカスタムの HTML 属性。

```js
Audio.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

### inline

audio ノードをインラインにするかどうか。

デフォルト: `false`

```js
Audio.configure({
  inline: true,
})
```

## コマンド

### setAudio(options)

指定したオプションで、現在の位置に audio 要素を挿入します。デフォルトではブロックレベルのノードとして埋め込まれますが、インラインにも設定できます。

```js
editor.commands.setAudio({
  src: 'https://example.com/audio.mp3',
  controls: true,
  autoplay: false,
})
```

#### オプション

| オプション            | 説明                                                                       | 省略可 | デフォルト     |
| --------------------- | -------------------------------------------------------------------------- | ------ | ---------- |
| src                   | 埋め込む音声ファイルの URL                                                 | ❌     | -          |
| controls              | ネイティブの音声コントロール（再生、一時停止、音量など）を表示する         | ✅     | true       |
| autoplay              | ページの読み込み時に音声の再生を自動で始める                               | ✅     | false      |
| loop                  | 音声を繰り返し再生する                                                     | ✅     | false      |
| muted                 | ミュートした状態で始める                                                   | ✅     | false      |
| preload               | 音声の読み込み方（'auto'、'metadata'、'none'、または null）                | ✅     | 'metadata' |
| controlslist          | 隠すコントロールのカンマ区切りリスト（例: 'nodownload'）                   | ✅     | undefined  |
| crossorigin           | audio 要素の CORS 設定（'anonymous'、'use-credentials'、または ''）        | ✅     | undefined  |
| disableRemotePlayback | 対応デバイスでリモート再生を無効にする                                     | ✅     | false      |
| HTMLAttributes        | audio 要素に適用する追加の HTML 属性                                       | ✅     | {}         |

## ソースコード

[packages/extension-audio/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-audio/)
