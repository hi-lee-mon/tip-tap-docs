# Twitch 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/nodes/twitch](https://tiptap.dev/docs/editor/extensions/nodes/twitch)

Twitch の動画、クリップ、ライブチャンネルをエディタに埋め込めるようにする拡張機能です。

[デモを開く](https://embed.tiptap.dev/preview/Nodes/Twitch)

**インタラクティブデモ:** Twitch の埋め込みプレーヤーのセキュリティポリシーにより、このインタラクティブデモは別のウィンドウで開く必要があります。

## 対応しているコンテンツの種類

- **動画**: Twitch の VOD への直接リンク
- **クリップ**: Twitch のクリップへのリンク
- **チャンネル**: Twitch のライブチャンネルへのリンク

## インストール

```bash
npm install @tiptap/extension-twitch
```

## 設定

### inline

ノードをインラインとして扱うか、ブロックとして扱うかを指定します。

デフォルト: `false`

```js
Twitch.configure({
  inline: false,
})
```

### width

追加する動画のデフォルトの幅を指定します。

デフォルト: `640`

```js
Twitch.configure({
  width: 480,
})
```

### height

追加する動画のデフォルトの高さを指定します。

デフォルト: `480`

```js
Twitch.configure({
  height: 320,
})
```

### allowFullscreen

iframe の全画面再生を許可します。

デフォルト: `true`

```js
Twitch.configure({
  allowFullscreen: false,
})
```

### autoplay

プレーヤーの読み込み後に、iframe の再生を自動で始めることを許可します。

デフォルト: `false`

```js
Twitch.configure({
  autoplay: true,
})
```

### muted

動画の初期状態をミュートにするかどうかを指定します。多くのブラウザでは自動再生にミュートが必要なため、autoplay を有効にしたときに便利です。

デフォルト: `false`

```js
Twitch.configure({
  muted: true,
})
```

### time

動画の再生を始める時間です。動画の埋め込みでだけ使え、クリップやチャンネルには使えません。
形式: `1h2m3s`（時、分、秒）。

デフォルト: `undefined`

```js
Twitch.configure({
  time: '1h2m3s',
})
```

### parent

Twitch プレーヤーを埋め込むドメインを指定します。Twitch の埋め込みを正しく動かすために必須です。自分のドメインを設定してください。

デフォルト: `'localhost'`

```js
Twitch.configure({
  parent: 'example.com',
})
```

### addPasteHandler

Twitch の動画 URL 用の貼り付けハンドラーを追加するかどうかを指定します。有効にすると、Twitch の動画 URL を貼り付けたときに自動で埋め込みが作られます。

デフォルト: `true`

```js
Twitch.configure({
  addPasteHandler: false,
})
```

### HTMLAttributes

iframe 要素にカスタムの HTML 属性を渡します。

デフォルト: `{}`

```js
Twitch.configure({
  HTMLAttributes: {
    class: 'custom-twitch-embed',
  },
})
```

## コマンド

### setTwitchVideo(options)

現在の位置に、Twitch 動画の iframe 埋め込みを挿入します。

```js
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
  width: 640,
  height: 480,
})
```

#### オプション

- `src` - Twitch 動画の URL（省略可）
- `width` - 埋め込みの幅。デフォルトのオプションを上書きします（省略可）
- `height` - 埋め込みの高さ。デフォルトのオプションを上書きします（省略可）

## 使用例

### 基本的な使い方

```js
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Twitch } from '@tiptap/extension-twitch'

const editor = useEditor({
  extensions: [
    StarterKit,
    Twitch.configure({
      parent: 'example.com',
    }),
  ],
  content: '<p>Hello World!</p>',
})
```

### 設定をカスタマイズする

```js
const editor = useEditor({
  extensions: [
    StarterKit,
    Twitch.configure({
      parent: 'example.com',
      width: 800,
      height: 600,
      allowFullscreen: true,
      autoplay: false,
      addPasteHandler: true,
    }),
  ],
})
```

### プログラムから挿入する

```js
// デフォルトのサイズで Twitch 動画を挿入する
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
})

// サイズを指定して挿入する
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
  width: 960,
  height: 540,
})

// autoplay と muted を指定して挿入する
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
  autoplay: true,
  muted: true,
})

// 開始時間を指定して挿入する
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
  time: '1h2m3s',
})
```

## 属性による上書き

動画を挿入するときに属性を指定すると、埋め込みごとに拡張機能のオプションを上書きできます。拡張機能のオプションをデフォルトとして使いつつ、埋め込みごとに違う設定にできます。

```js
// 拡張機能はデフォルトで autoplay=false に設定
Twitch.configure({
  parent: 'example.com',
  autoplay: false,
})

// ただし、この動画だけは autoplay を有効にして挿入する
editor.commands.setTwitchVideo({
  src: 'https://www.twitch.tv/videos/1234567890',
  autoplay: true, // 拡張機能の autoplay オプションを上書きする
  muted: true, // 音声を確実にミュートする
})
```

## 対応している URL の形式

この拡張機能は、次の Twitch の URL 形式に対応しています。

### 動画

- `https://www.twitch.tv/videos/1234567890`
- `https://twitch.tv/videos/1234567890`

### クリップ

- `https://www.twitch.tv/examplechannel/clip/ExampleClipName-ABC123`
- `https://twitch.tv/examplechannel/clip/ExampleClipName-ABC123`
- `https://clips.twitch.tv/ExampleClipName-ABC123`
- `https://www.clips.twitch.tv/ExampleClipName-ABC123`

### チャンネル

- `https://www.twitch.tv/examplechannel`
- `https://twitch.tv/examplechannel`

## 貼り付けへの対応

`addPasteHandler` が有効（デフォルト）なら、Twitch の動画 URL をエディタに貼り付けるだけで、自動的に埋め込みに変換されます。

```
Paste this URL: https://www.twitch.tv/videos/1234567890
↓
Automatically creates a Twitch embed node
```

## 注意点

- Twitch の埋め込みを正しく表示するには、`parent` ドメインの設定が必須です。実際のドメインを必ず設定してください。
- セキュリティ上の理由から、Twitch の埋め込みでは、親ドメインが Twitch 側の許可リストに登録されている必要があります。
- 不正なコンテンツを防ぐため、拡張機能は埋め込みを作る前に URL を検証します。
- 埋め込みはドラッグでき、ドキュメント内で位置を変えられます。

## キーボードショートカット

- Twitch の埋め込みを選択して `Backspace` または `Delete` を押すと削除されます
- キーボード操作と矢印キーで Twitch の埋め込みを選択できます

## ソースコード

[packages/extension-twitch/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-twitch/)
