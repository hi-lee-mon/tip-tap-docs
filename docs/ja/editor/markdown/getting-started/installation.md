# Markdown パッケージのインストールとセットアップ

> 原文: [https://tiptap.dev/docs/editor/markdown/getting-started/installation](https://tiptap.dev/docs/editor/markdown/getting-started/installation)

このガイドでは、Tiptap エディタに Markdown 拡張機能をインストールしてセットアップする手順を説明します。

## インストール

使い慣れたパッケージマネージャーで Markdown 拡張機能をインストールします。

```bash
npm install @tiptap/markdown
```

## 基本のセットアップ

エディタに Markdown 拡張機能を追加します。

```typescript
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit, Markdown],
  content: '<p>Hello World!</p>',
})
```

これだけです。エディタで Markdown のパースとシリアライズが使えるようになりました。

### 初期コンテンツを Markdown で渡す

エディタの作成時に Markdown のコンテンツを読み込むには、次のようにします。

```typescript
const editor = new Editor({
  extensions: [StarterKit, Markdown],
  content: '# Hello World\n\nThis is **Markdown**!',
  contentType: 'markdown',
})
```

## 設定オプション

Markdown 拡張機能では、次の設定オプションを指定できます。

### インデントの形式

シリアライズした Markdown で、入れ子の構造（リストやコードブロック）をどうインデントするかを設定します。

```typescript
Markdown.configure({
  indentation: {
    style: 'space', // 'space' または 'tab'
    size: 2, // スペースまたはタブの数
  },
})
```

**例:**

```typescript
// インデントにスペース4つを使う（デフォルトはスペース2つ）
Markdown.configure({
  indentation: { style: 'space', size: 4 },
})

// インデントにタブを使う
Markdown.configure({
  indentation: { style: 'tab', size: 1 },
})
```

### marked のインスタンスを自分で用意する

独自のバージョンの marked を使いたいときや、事前に設定しておきたいときは、次のようにします。

```typescript
import { marked } from 'marked'

// marked を設定する
marked.setOptions({
  gfm: true,
  breaks: true,
})

// 用意した marked のインスタンスを使う
Markdown.configure({
  marked: marked,
})
```

### marked のオプション

marked のオプションを拡張機能に直接渡すこともできます。

```typescript
Markdown.configure({
  markedOptions: {
    gfm: true, // GitHub Flavored Markdown
    breaks: false, // \n を <br> に変換する
    pedantic: false, // 厳密な Markdown モード
  },
})
```

指定できるオプションの一覧は、[marked のドキュメント](https://marked.js.org/using_advanced#options)を参照してください。

## インストールの確認

拡張機能が正しくインストールされたかは、次のように確かめます。

```typescript
// Markdown マネージャーが使えるか確認する
console.log(editor.markdown) // MarkdownManager のインスタンスが出力されるはず

// パースを試す
const json = editor.markdown.parse('# Hello')
console.log(json)
// { type: 'doc', content: [...] }

// シリアライズを試す
const markdown = editor.markdown.serialize(json)
console.log(markdown)
// # Hello
```

## よくある問題

### 拡張機能が見つからない

`@tiptap/markdown` が見つからないというエラーが出る場合は、次を試してください。

1. インストールされているか確認する: `npm list @tiptap/markdown`
2. ビルドのキャッシュと node_modules を消す
3. 依存関係をインストールし直す

### Markdown がパースされない

Markdown がパースされない場合は、次を確認してください。

1. 初期コンテンツを設定するときに `contentType: 'markdown'` を指定しているか
2. または、`setContent()` を呼ぶときに `contentType: 'markdown'` オプションを指定しているか

### TypeScript のエラー

TypeScript のエラーが出る場合は、次を確認してください。

1. `@tiptap/core` がインストールされているか（型定義が含まれています）
2. 両方のパッケージが最新バージョンになっているか
3. `tsconfig.json` のモジュール解決の設定が正しいか

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```
