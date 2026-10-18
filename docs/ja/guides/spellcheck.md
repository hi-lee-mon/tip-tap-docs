# Tiptap でスペルチェックを有効にする

> 原文: [https://tiptap.dev/docs/guides/spellcheck](https://tiptap.dev/docs/guides/spellcheck)

ブラウザのスペルチェックを使うと、つづりの誤った単語に下線が引かれ、ブラウザのコンテキストメニューに修正候補が表示されます。設定するのはエディタの属性2つだけで、追加の拡張機能は要りません。

独自の候補メニューや独自の辞書が必要な場合、またはブラウザ間で結果をそろえたい場合は、[独自のスペルチェッカーを組み込みます](#integrate-a-custom-spell-checker)。

以下の例は、[Tiptap をインストール済み](https://tiptap.dev/docs/editor/getting-started/install/vanilla-javascript)であることを前提にしています。

## ブラウザのスペルチェックを有効にする

既存のエディタでは、[`editorProps.attributes`](../editor/api/editor.md#editorprops) に `spellcheck` と `lang` を追加します。これらの DOM 属性は文字列を使うので、値は文字列の `'true'` にしてください。

新しく JavaScript のエディタを作る場合は、HTML にコンテナを追加します。

```html
<div id="editor"></div>
```

次に、エディタを作ります。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit],
  content: '<p>This sentense has a spelling mistake.</p>',
  editorProps: {
    // これらの属性を編集可能な要素に適用する。
    attributes: {
      // ブラウザにスペルチェックを依頼する。
      spellcheck: 'true',
      // テキストの言語を宣言する。ブラウザの辞書の設定もそのまま適用される。
      lang: 'en-US',
    },
  },
})
```

React や Vue では、同じ `editorProps` オプションを `useEditor` に渡します。これで、`EditorContent` の中にある編集可能な要素に属性が付きます。

エディタ内をクリックし、`sentense` と入力してスペースキーを押してください。スペルチェックが有効なら、ブラウザがその単語に下線を引きます。単語のコンテキストメニューを開くと、修正候補が表示されます。

HTML の [`spellcheck` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/spellcheck)は、ブラウザにスペルチェックを依頼するものです。それでもユーザーはチェックを無効にできます。[`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang) には、ドイツ語なら `de-DE` のように、テキストの言語を設定します。ブラウザ側にも、その言語の辞書が必要です。

### 実行中にスペルチェックを切り替える

ブラウザのスペルチェックのオンとオフは、[`setOptions()`](../editor/api/editor.md#setoptions) で切り替えます。イベントハンドラーや設定を失わないよう、既存の props と属性はコピーして引き継いでください。

上のエディタのセットアップの後に、次の関数を追加します。

```js
function setSpellcheck(enabled) {
  const editorProps = editor.options.editorProps

  editor.setOptions({
    editorProps: {
      // 既存のイベントハンドラーやほかのエディタの props を引き継ぐ。
      ...editorProps,
      attributes: {
        // class、role、lang などの属性を引き継ぐ。
        ...editorProps.attributes,
        // DOM 属性の値は文字列。
        spellcheck: enabled ? 'true' : 'false',
      },
    },
  })
}

setSpellcheck(false)
```

`attributes` を関数で指定している場合は、オブジェクトとして展開するのではなく、その関数を更新してください。

### 素の ProseMirror でスペルチェックを有効にする

ProseMirror では、属性を [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorProps.attributes) に直接渡します。

```js
import { EditorView } from 'prosemirror-view'

// state は、スキーマとプラグインを含む既存の EditorState。
const view = new EditorView(document.querySelector('#editor'), {
  state,
  // ProseMirror はこれらの属性を編集可能な要素に適用する。
  attributes: {
    // 英語のテキストに対して、ブラウザ標準のスペルチェックを依頼する。
    spellcheck: 'true',
    lang: 'en-US',
  },
})
```

### スペルの修正候補が出ないときの確認事項

スペルの下線が表示されない場合は、次の設定を確認してください。

1. 編集可能な `.tiptap` または `.ProseMirror` 要素を調べ、`contenteditable="true"` と `spellcheck="true"` が付いていることを確かめる
2. ブラウザまたは OS でスペルチェックを有効にし、テキストの言語の辞書をインストールまたは選択する
3. エディタ内をクリックし、つづりの誤った単語を入力してスペースキーを押す。ブラウザによっては、既存のテキストは編集するまでチェックしない
4. 独自のノードビューや入れ子の要素に `spellcheck="false"` や `contenteditable="false"` がないかを調べる。これらがあると、テキストがチェックの対象から外れることがある
5. 下線は出るのに修正候補が出ない場合は、アプリがブラウザのコンテキストメニューを置き換えていないか、`contextmenu` イベントを止めていないかを確認する

アプリが対応するブラウザとデバイスで試してください。下線と候補メニューはブラウザが制御します。アプリ側でエラーを読み取ったり、下線のスタイルを変えたりしたい場合は、独自のチェッカーを使います。

## 独自のスペルチェッカーを組み込む

次の例では、nspell を使って英語のテキストをチェックします。エラーは拡張機能に保存し、[`addDecorations()`](../editor/api/decorations.md#adddecorations) で下線を引きます。デコレーションは、保存されるドキュメントを変えずにテキストの見た目を変えます。

ほかの例は[デコレーションのガイド](../editor/core-concepts/decorations.md)を参照してください。メソッドや更新の設定は [Decorations API リファレンス](../editor/api/decorations.md)で調べられます。

### チェックエンジンを選ぶ

- [`nspell`](https://github.com/wooorm/nspell) は、単語を辞書と照合してチェックします。`correct(word)` でつづりをチェックし、`suggest(word)` で修正候補を返します。以下の例のように、ローカルでのスペルチェックに使います。
- [LanguageTool](https://dev.languagetool.org/http-server) は、HTTP サービスを通じてスペルと文法をチェックします。ユーザーの入力に合わせてチェックするには、自前のサーバーか、自動リクエストを許可している API プランを使ってください。[無料の公開エンドポイント](https://dev.languagetool.org/public-http-api.html)では、自動リクエストが禁止されています。

以下の JavaScript のコード片は、示した順に1つのブラウザ用モジュールにまとめて書きます。これはブラウザのスペルチェックの例とは別のエディタのセットアップです。コンテナは同じ `<div id="editor"></div>` を使います。

### 1. エラーを保存して下線を引く

`Spellcheck` 拡張機能を作ります。そのストレージには、エラーと `checkedDoc`（チェッカーが読み取ったドキュメントのバージョン）を保持します。ドキュメントが変わったら、拡張機能は古い下線を隠します。

```js
import { Decoration, Extension } from '@tiptap/core'

const Spellcheck = Extension.create({
  name: 'spellcheck',

  addStorage() {
    // チェッカーの結果は、保存されるドキュメントの外に持つ。
    return { checkedDoc: null, errors: [] }
  },

  addDecorations() {
    return {
      // 編集のたびに再構築し、古いドキュメントに対する結果を消す。
      update: 'document',
      create: ({ state }) => {
        // チェッカーが使ったドキュメントのスナップショットに対してだけ結果を表示する。
        if (this.storage.checkedDoc !== state.doc) return []

        // テキストは変えずに、各エラーのドキュメント内の範囲に下線を引く。
        return this.storage.errors.map(({ from, to }) =>
          Decoration.Inline(from, to, { class: 'spellcheck-error' }),
        )
      },
    }
  },
})
```

### 2. エディタを作る

`StarterKit` と一緒に `Spellcheck` を登録します。下線を引くのが独自のチェッカーだけになるよう、ブラウザのスペルチェックは無効にします。

```js
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit, Spellcheck],
  content: '<p>This sentense has a spelling mistake.</p>',
  editorProps: {
    attributes: { spellcheck: 'false', lang: 'en-US' },
  },
})
```

結果を保存して下線を更新する関数を追加します。各エラーには、ドキュメント内での単語の開始位置と終了位置を表す `from` と `to` が必要です。

```js
function showSpellcheckResults(checkedDoc, errors) {
  // チェック中にエディタが閉じられたか、ドキュメントが変わった場合は結果を無視する。
  if (editor.isDestroyed || editor.state.doc !== checkedDoc) return

  // チェックしたスナップショットと、それに対応するエラーを保存する。
  editor.storage.spellcheck.checkedDoc = checkedDoc
  editor.storage.spellcheck.errors = errors
  // ストレージを変えたら、デコレーションの更新を明示的に指示する必要がある。
  editor.commands.updateDecorations('spellcheck')
}
```

アプリのスタイルシートに次のルールを追加します。

```css
.spellcheck-error {
  /* 各エラーの下に赤い波線を引く。 */
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-color: #c62828;
}
```

ストレージを変えるだけでは、下線は再描画されません。[`updateDecorations()`](../editor/api/decorations.md#updatedecorations) を呼ぶと、Tiptap は保存されたエラーからデコレーションを再構築します。

### 3. 英語の辞書を読み込む

nspell と [英語の Hunspell 辞書](https://github.com/wooorm/dictionaries/tree/main/dictionaries/en)をインストールします。

```sh
npm install nspell dictionary-en
```

`dictionary-en` は Node.js を使ってファイルを読み込みます。ブラウザで辞書を使うには、ファイルをアプリの公開アセットにコピーします。アプリのルートディレクトリで次のコマンドを実行してください。

```sh
mkdir -p public/dictionaries
cp node_modules/dictionary-en/index.aff public/dictionaries/en.aff
cp node_modules/dictionary-en/index.dic public/dictionaries/en.dic
```

ここでは、アプリが `public/dictionaries/en.aff` を `/dictionaries/en.aff` で配信することを前提にしています。フレームワークやベース URL に合わせてパスを調整してください。

ファイルは起動時に一度だけ読み込みます。次のコードを、エディタと同じブラウザ用モジュールに書きます。

```js
import nspell from 'nspell'

async function createEnglishSpellchecker() {
  // アプリの静的アセットから、接辞のルールと単語リストを取得する。
  const [aff, dic] = await Promise.all(
    ['/dictionaries/en.aff', '/dictionaries/en.dic'].map(async (url) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load dictionary: ${url}`)
      return response.text()
    }),
  )

  // nspell は辞書のデータを文字列で受け取る。
  return nspell({ aff, dic })
}

const spell = await createEnglishSpellchecker()
```

### 4. エラーを見つけて保存する

段落や見出しは1つずつ別々にチェックします。書式のマークをまたいでテキストをつなげ、`sen<strong>ten</strong>se` を1つの単語として扱います。コードと、画像のようなテキスト以外のインラインノードは飛ばします。

ドキュメント内の位置は、テキストとノードの境界を数えたものです。`editor.getText()` でのオフセットとは異なります。次の関数では、飛ばしたコンテンツを同じ長さの空白に置き換えて、位置がずれないようにしています。

```js
function findSpellingErrors(doc, spell) {
  const errors = []

  doc.descendants((block, blockPos) => {
    // コードブロックは、その子孫も含めて飛ばす。
    if (block.type.spec.code) return false
    if (!block.isTextblock) return

    let text = ''

    block.forEach((child) => {
      const isCode = child.marks.some((mark) => mark.type.spec.code)

      // テキストノードのサイズは、JavaScript の文字列の長さと等しい。
      // コード、改行、インラインノードは空白にして、オフセットをそろえる。
      text += child.isText && !isCode ? child.text : ' '.repeat(child.nodeSize)
    })

    // nspell は単語単位でチェックする。このトークナイザーは文字と短縮形を拾う。
    for (const match of text.matchAll(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu)) {
      const checkedWord = match[0]
      // 辞書を引くときだけ、曲がったアポストロフィを正規化する。
      const word = checkedWord.replaceAll('’', "'")
      if (spell.correct(word)) continue

      // テキストブロックの開始トークンの分として 1 を足す。
      const from = blockPos + 1 + match.index
      errors.push({
        from,
        to: from + checkedWord.length,
        checkedWord,
        suggestions: spell.suggest(word),
      })
    }

    // このブロックはチェック済み。子ノードはもう一度たどらない。
    return false
  })

  return errors
}

function checkEnglishDocument() {
  if (editor.isDestroyed) return

  // 1つのスナップショットをチェックし、結果を保存してデコレーションを更新する。
  const checkedDoc = editor.state.doc
  const errors = findSpellingErrors(checkedDoc, spell)
  showSpellcheckResults(checkedDoc, errors)
}

checkEnglishDocument()
```

サンプルのドキュメントでは、`editor.storage.spellcheck.errors` に `sentense` のエラーが `from: 6`、`to: 14` で入ります。その単語には赤い波線が引かれるはずです。修正メニューは、エラーの `suggestions` 配列を使って作ります。

ユーザーの入力に合わせて再チェックするには、入力が 300 ミリ秒止まるまで待ちます。最初のチェックの後に次のコードを追加してください。

```js
let spellcheckTimer

editor.on('update', () => {
  // ドキュメントが変わるたびにタイマーをやり直す。
  clearTimeout(spellcheckTimer)
  spellcheckTimer = setTimeout(checkEnglishDocument, 300)
})

editor.on('destroy', () => {
  // エディタが閉じられたら、予定していたチェックを取り消す。
  clearTimeout(spellcheckTimer)
})
```

この例では、メインスレッドでドキュメント全体をチェックします。大きなドキュメントでは、Web Worker を使うか、変更されたブロックだけをチェックしてください。単語に一致させるパターンは、文字と短縮形を扱います。数字や URL の扱いは、アプリのルールに合わせて調整してください。

### 5. 修正を適用する

ユーザーが候補を選んだら、保存しておいたエラーと置換後のテキストを次の関数に渡します。

```js
function applySpellingSuggestion(error, replacement) {
  if (editor.isDestroyed) return
  const { state, view } = editor
  const { from, to, checkedWord } = error

  // 古いバージョンのドキュメントに対する候補は無視する。
  if (editor.storage.spellcheck.checkedDoc !== state.doc) return

  // その範囲に、チェックした単語がまだあることを確かめる。
  if (state.doc.textBetween(from, to, '') === checkedWord) {
    // トランザクションにすると、履歴と共同編集が置換を追跡できる。
    view.dispatch(state.tr.insertText(replacement, from, to))
  }
}
```

置換には [`insertText()`](https://prosemirror.net/docs/ref/#state.Transaction.insertText) を使ってください。そうすれば、設定済みの履歴や共同編集のプラグインが置換を追跡できます。`innerHTML` を置き換えたり、DOM のテキストノードを直接編集したりしないでください。

候補メニューはキーボードで操作できるようにしてください。修正を受け入れる、単語を無視する、アプリの辞書に追加する、といった操作部品を用意します。太字や斜体のテキストをまたぐ単語では、置換後にどの書式を残すかを決めておきます。

### 別のチェッカーを使う

LanguageTool などのサービスを使うには、`findSpellingErrors()` をそのチェッカーの呼び出しに置き換えます。エラーのフィールドは同じにして、結果を `showSpellcheckResults()` に渡してください。

非同期でチェックする場合は、リクエストを送る前に `editor.state.doc` を取っておき、そのドキュメントのバージョンを結果と一緒に渡します。リクエスト中に（共同編集者の編集も含めて）ドキュメントが変わっていれば、`showSpellcheckResults()` が結果を捨てます。ドキュメントが変わるたびに、新しいチェックを予約してください。

サービスがプレーンテキストでのオフセットを返す場合は、エラーを保存する前にドキュメント内の位置に変換します。送るテキストに区切り文字を加えたりコンテンツを取り除いたりするときは、位置の対応表を保持しておいてください。

デコレーションのほかの例は、[Vanilla JavaScript](https://tiptap.dev/docs/guides/decorations-vanilla)、[React](decorations-react.md)、[Vue](https://tiptap.dev/docs/guides/decorations-vue) のチュートリアルを参照してください。

### ドキュメントのプライバシーに配慮する

外部のチェックサービスを使う場合は、チェックしたいテキストだけを送り、サービスの認証情報はサーバー側に置いてください。デバイスの外に出してはいけないコンテンツには、ローカルのチェックエンジンを使います。

ブラウザのスペルチェックも、ユーザーのブラウザの設定によっては、テキストを外部のサービスに送ることがあります。機密性の高いコンテンツで有効にする前に、MDN の [spellcheck のプライバシーに関する注意](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/spellcheck#security_and_privacy_concerns)を確認してください。
