# Youtube 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/youtube](https://tiptap.dev/docs/editor/extensions/nodes/youtube)

YouTube の埋め込み用の新しいノードをエディタに追加する拡張機能です。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/YouTube)

## インストール

```bash
npm install @tiptap/extension-youtube
```

## 設定

### inline

ノードをインラインとして扱うか、ブロックとして扱うかを指定します。

デフォルト: `false`

```js
Youtube.configure({
  inline: false,
})
```

### width

追加する動画のデフォルトの幅を指定します

デフォルト: `640`

```js
Youtube.configure({
  width: 480,
})
```

### height

追加する動画のデフォルトの高さを指定します

デフォルト: `480`

```js
Youtube.configure({
  height: 320,
})
```

### controls

YouTube 動画のコントロールを有効または無効にします

デフォルト: `true`

```js
Youtube.configure({
  controls: false,
})
```

### nocookie

YouTube の埋め込みで nocookie モードを有効にします

デフォルト: `false`

```js
Youtube.configure({
  nocookie: true,
})
```

### allowFullscreen

iframe の全画面再生を許可します

デフォルト: `true`

```js
Youtube.configure({
  allowFullscreen: false,
})
```

### autoplay

プレーヤーの読み込み後に、iframe の再生を自動で始めることを許可します

デフォルト: `false`

```js
Youtube.configure({
  autoplay: true,
})
```

### ccLanguage

プレーヤーが字幕の表示に使うデフォルトの言語を指定します。値には ISO 639-1 の 2 文字の言語コードを設定します。たとえば `es` にすると、字幕がスペイン語になります

デフォルト: `undefined`

```js
Youtube.configure({
  ccLanguage: 'es',
})
```

### ccLoadPolicy

`true` にすると、ユーザーが字幕をオフにしていても、デフォルトで字幕が表示されます

デフォルト: `false`

```js
Youtube.configure({
  ccLoadPolicy: true,
})
```

### disableKBcontrols

iframe プレーヤーのキーボード操作を無効にします

デフォルト: `false`

```js
Youtube.configure({
  disableKBcontrols: true,
})
```

### enableIFrameApi

IFrame Player API の呼び出しでプレーヤーを操作できるようにします

デフォルト: `false`

```js
Youtube.configure({
  enableIFrameApi: true,
})
```

### origin

IFrame API のセキュリティを高めるための追加の設定で、IFrame の埋め込みでだけ使えます。IFrame API を使う場合、つまり `enableIFrameApi` を `true` にしている場合は、必ず自分のドメインを `origin` の値に指定してください。

デフォルト: `''`

```js
Youtube.configure({
  origin: 'yourdomain.com',
})
```

### endTime

プレーヤーが動画の再生を止める時間を、動画の先頭からの秒数で指定します。
たとえば `15` にすると、動画は 15 秒の地点で止まります

デフォルト: `0`

```js
Youtube.configure({
  endTime: '15',
})
```

### interfaceLanguage

プレーヤーの UI の言語を設定します。値は ISO 639-1 の 2 文字の言語コードです。たとえば `fr` にすると、UI がフランス語になります

デフォルト: `undefined`

```js
Youtube.configure({
  interfaceLanguage: 'fr',
})
```

### ivLoadPolicy

1 にすると動画のアノテーションがデフォルトで表示され、3 にするとデフォルトで表示されなくなります

デフォルト: `0`

```js
Youtube.configure({
  ivLoadPolicy: '3',
})
```

### loop

IFrame の埋め込みでは、この設定の対応は限られています。1 本の動画をループさせるには、loop を `true` にし、playlist に Player API の URL で指定済みの動画 ID と同じものを設定します。

デフォルト: `false`

```js
Youtube.configure({
  loop: true,
})
```

### playlist

再生する動画 ID をカンマ区切りのリストで指定します。

デフォルト: `''`

```js
Youtube.configure({
  playlist: 'VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3,...,VIDEO_ID_N',
})
```

### modestBranding

プレーヤーのコントロールバーにある YouTube のロゴを非表示にします。ただし、一時停止中の動画にマウスポインターを重ねると、右上に小さな YouTube の文字ラベルは表示されます

デフォルト: `false`

```js
Youtube.configure({
  modestBranding: true,
})
```

### progressBarColor

プレーヤーの再生進行バーに使う色を指定します。`white` にすると `modestBranding` の設定が無効になる点に注意してください

デフォルト: `undefined`

```js
Youtube.configure({
  progressBarColor: 'white',
})
```

## コマンド

### setYoutubeVideo(options)

現在の位置に YouTube の iframe 埋め込みを挿入します

```js
editor.commands.setYoutubeVideo({
  src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  width: 640,
  height: 480,
})
```

#### オプション

| オプション | 説明                                                                 | 省略可 |
| ---------- | -------------------------------------------------------------------- | ------ |
| src        | YouTube 動画の URL。YouTube と YouTube Music のどちらのリンクも使える |
| width      | 埋め込みの幅（デフォルトのオプションを上書き。省略可）               | ✅     |
| height     | 埋め込みの高さ（デフォルトのオプションを上書き。省略可）             | ✅     |

## ソースコード

[packages/extension-youtube/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-youtube/)
