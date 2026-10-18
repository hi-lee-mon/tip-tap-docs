# Find and Replace 拡張機能

> 原文: [https://tiptap.dev/docs/editor/extensions/functionality/find-and-replace](https://tiptap.dev/docs/editor/extensions/functionality/find-and-replace)

Find and Replace 拡張機能は、ドキュメントを検索して一致した箇所を強調表示し、結果の移動と置換のためのコマンドを提供します。ヘッドレスなので、操作部品を自分で作り、アプリのどこにでも置けます。

[デモを開く](https://embed.tiptap.dev/preview/Extensions/FindAndReplace)

## インストール

```bash
npm install @tiptap/extension-find-and-replace
```

## 使い方

```js
import { Editor } from '@tiptap/core'
import FindAndReplace from '@tiptap/extension-find-and-replace'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit, FindAndReplace],
})
```

React と Vue の完全な例は、[独自の UI のガイド](../../../guides/find-and-replace.md)を参照してください。

## 設定

ここでのオプションは初期状態を決めます。エディタの動作中に検索を更新するには、下のコマンドを使ってください。

### searchTerm

最初に検索する文字列です。正規表現モードでは、正規表現のパターンになります。

デフォルト: `''`

```js
FindAndReplace.configure({
  searchTerm: 'Tiptap',
})
```

### replaceTerm

置換のコマンドが最初に使う文字列です。正規表現モードを有効にしている場合は、置換後の文字列に、一致した部分全体やキャプチャグループを再利用できます。

デフォルト: `''`

```js
FindAndReplace.configure({
  useRegex: true,
  searchTerm: '(color|colour)',
  replaceTerm: '[$1]',
})
```

### caseSensitive

大文字と小文字を区別して検索するかどうかです。

デフォルト: `false`

```js
FindAndReplace.configure({
  caseSensitive: true,
})
```

### useRegex

`searchTerm` を正規表現として扱うかどうかです。

デフォルト: `false`

```js
FindAndReplace.configure({
  useRegex: true,
  searchTerm: 'colou?r',
})
```

正規表現モードは `caseSensitive` や `wholeWord` と組み合わせられます。無効なパターンや、安全でないとして拒否されたパターンでは、結果は返りません。正規表現モードは RE2 互換の構文を使うので、検索パターンで先読み・後読みや後方参照は使えません。

### wholeWord

一致した部分の両側に Unicode の単語境界があることを条件にするかどうかです。通常の検索でも正規表現の検索でも働きます。Unicode の単語構成文字には、文字、結合文字、数字、`_` などの連結用の句読点が含まれます。

デフォルト: `false`

```js
FindAndReplace.configure({
  caseSensitive: true,
  useRegex: true,
  wholeWord: true,
  searchTerm: 'cat|catalog',
})
```

たとえばこの設定では、`cat` と `catalog` には一致しますが、`cats` や `Catalog` には一致しません。先に見つかった結果が単語境界の条件を満たさない場合、正規表現エンジンは後ろの選択肢や、より長い一致を試します。

### searchDebounceMs

`setSearchTerm()` が検索結果を更新するまでの待ち時間（ミリ秒）です。`0` にするとすぐに結果を更新します。

デフォルト: `250`

```js
FindAndReplace.configure({
  searchDebounceMs: 0,
})
```

### injectCSS

結果を強調表示するデフォルトのスタイルを挿入するかどうかです。独自のスタイルを使う場合は無効にしてください。

デフォルト: `true`

```js
FindAndReplace.configure({
  injectCSS: false,
})
```

### injectNonce

挿入する style 要素に付ける nonce です。Content Security Policy で nonce が必要な場合に指定します。

デフォルト: `undefined`

```js
FindAndReplace.configure({
  injectNonce: 'your-nonce-here',
})
```

## コマンド

### setSearchTerm()

検索する文字列を設定し、一致した箇所をすべて強調表示します。

```js
editor.commands.setSearchTerm('Tiptap')
```

### setReplaceTerm()

`replace()` と `replaceAll()` が使う文字列を設定します。正規表現モードでは、置換後の文字列にキャプチャグループの置き換えを含められます。

```js
editor.commands.setReplaceTerm('[$1]')
```

#### 正規表現の置換で使えるトークン

正規表現モードを有効にしている場合、置換後の文字列では、JavaScript と同じ形の次のトークンを使えます。

| トークン | 置き換わる内容 |
| ---------- | ---------------------------------------- |
| `$$` | 文字としての `$` |
| `$&` | 一致した部分全体 |
| `$1`–`$99` | 対応する番号付きのキャプチャグループ |
| `$<name>` | 対応する名前付きのキャプチャグループ |

一致しなかったグループには空文字列が入ります。1桁の番号の参照がパターンのキャプチャ数を超える場合は、そのまま残ります。2桁の参照には JavaScript と同じ代替の規則が適用されます。2桁の番号のキャプチャが存在せず、1桁目の番号のキャプチャが存在する場合は、そのキャプチャのあとに2桁目の数字を続けて挿入します。たとえば、キャプチャが1つのパターンで `$12` と書くと、キャプチャ 1 のあとに `2` が挿入されます。`$01` のようなゼロ埋めの参照も JavaScript の意味に従い、キャプチャ 1 を指します。存在しない名前の参照は、パターンに名前付きグループがあれば空文字列になり、なければそのまま残ります。

ほかの `$` の並びはそのまま残ります。JavaScript の一致前を表すトークン（`$` のあとにバッククォート）と一致後を表すトークン（`$'`）は展開しません。正規表現モードを無効にしている場合は、置換後の文字列をすべてそのまま挿入します。

正規表現モードで、対応しているトークンを文字どおりに残したい場合は、先頭のドル記号を `$$` でエスケープします。たとえば `$$1` と書くと `$1` が挿入されます。

```js
editor.commands.setUseRegex(true)
editor.commands.setSearchTerm('(color|colour)')
editor.commands.setReplaceTerm('[$1]')
editor.commands.replaceAll()
// "color and colour" は "[color] and [colour]" になる
```

### setCaseSensitive()

大文字と小文字を区別する検索を有効または無効にします。通常のモードでも正規表現モードでも働きます。

```js
editor.commands.setCaseSensitive(true)
```

### setUseRegex()

正規表現による検索を有効または無効にします。正規表現モードは、大文字と小文字の区別（Match case）や単語単位の検索（Whole word）と同時に有効にできます。

```js
editor.commands.setUseRegex(true)
```

### setWholeWord()

通常の検索や正規表現の検索で、Unicode に対応した単語単位の検索を有効または無効にします。

```js
editor.commands.setWholeWord(true)
```

### goToNextResult()

次の結果を選択します。最後の結果の次は、最初の結果に戻ります。

```js
editor.commands.goToNextResult()
```

### goToPreviousResult()

前の結果を選択します。最初の結果の前は、最後の結果に戻ります。

```js
editor.commands.goToPreviousResult()
```

### replace()

選択中の結果を置換し、次に残っている結果を選択します。

```js
editor.commands.replace()
```

### replaceAll()

現在の結果をすべて置換します。

```js
editor.commands.replaceAll()
```

### clearSearch()

検索する文字列を消し、結果の強調表示をすべて取り除きます。

```js
editor.commands.clearSearch()
```

## ストレージ

この拡張機能は、現在の状態を `editor.storage.findAndReplace` に保持します。

### searchTerm

現在の検索する文字列です。

```js
editor.storage.findAndReplace.searchTerm
```

### replaceTerm

現在の置換後の文字列です。

```js
editor.storage.findAndReplace.replaceTerm
```

### caseSensitive、useRegex、wholeWord

現在の検索のオプションです。

```js
editor.storage.findAndReplace.caseSensitive
editor.storage.findAndReplace.useRegex
editor.storage.findAndReplace.wholeWord
```

### results

一致した箇所を、ドキュメント内の順に並べたものです。各結果は ProseMirror の位置 `from` と `to` を持ちます。

```js
editor.storage.findAndReplace.results
```

### currentIndex

選択中の結果のインデックスです。どの結果も選択していない場合は `null` です。

```js
editor.storage.findAndReplace.currentIndex
```

## 検索の動作

ドキュメントや検索のオプションが変わると、一致した箇所が更新されます。一致した箇所は、マークの異なるテキストノードにまたがることはありますが、テキストブロックをまたぐことはなく、強制改行やメンションなどのテキスト以外のインラインノードをまたぐこともありません。

大文字と小文字の区別（Match case）、正規表現（Regex）、単語単位（Whole word）はそれぞれ独立したオプションで、同時に有効にできます。正規表現と単語単位を組み合わせた場合、境界は正規表現の最終的な結果の前後で確認します。そのため、選択肢や量指定子は、完全な単語になるまで一致を続けられます。連続する一致は句読点の境界を共有できるので、`cat` を単語単位で探す正規表現は、`cat-cat.cat` の中の3か所すべてに一致します。

`replaceAll()` は、コマンドを実行した時点で存在する一致を置換します。置換後の文字列も検索に一致する場合、その新しい一致はトランザクションのあともストレージに残ります。

## 結果のスタイル

デフォルトでは、結果は黄色で、選択中の結果はオレンジで強調表示されます。このスタイルを置き換えるには、`injectCSS` を無効にしてください。

```css
.find-and-replace-result {
  background-color: rgb(255 225 0 / 0.4);
}

.find-and-replace-result-current {
  background-color: rgb(255 165 0 / 0.55);
}
```

## ソースコード

[packages/extension-find-and-replace/](https://github.com/ueberdosis/tiptap/tree/main/packages/extension-find-and-replace/)
