# 対訳表と翻訳ルール

このフォルダの日本語訳は、すべてこの表に従って訳語をそろえています。

## 翻訳ルール

- 文体は「です・ます」調。原文の "we" "you" は、日本語として自然なら主語ごと省く
- 次のものは訳さず原文のまま残す
  - コード、コマンド、パッケージ名、API 名（`useEditor`、`setContent`、`StarterKit` など）
  - 拡張機能の名前を固有名として使う場合（「`Bold` 拡張機能」「Bold 拡張機能」）
  - 見出しのアンカー（`#usage` など）とリンクの URL
- コードブロックの中は、コメントだけを訳す。文字列・識別子・出力例は変えない
- 見出しは訳す。そのためページ内アンカー（`[...](#usage)`）は日本語見出しとずれて機能しなくなるが、原文との対応を優先して URL は変えない
- 原文にない説明を足すときは「（訳注: ...）」と書いて区別する

## 対訳表

| 英語 | 日本語 | 備考 |
| --- | --- | --- |
| atom node | atom ノード | `atom` はスキーマのプロパティ名 |
| attribute | 属性 | |
| block / inline | ブロック / インライン | |
| blockquote | 引用ブロック | |
| breaking change | 破壊的変更 | |
| bullet list / ordered list | 箇条書きリスト / 番号付きリスト | |
| bubble menu | バブルメニュー | |
| chain (commands) | チェーン | 「コマンドをチェーンする」 |
| collaboration | 共同編集 | 製品名の Tiptap Collaboration は原文のまま |
| command | コマンド | |
| content | コンテンツ | |
| core | コア | `@tiptap/core` を指す |
| cursor / caret | カーソル / キャレット | |
| decoration | デコレーション | |
| default | デフォルト | 「デフォルト: `true`」の形 |
| document | ドキュメント | ProseMirror の doc ノードも「ドキュメント」 |
| drag handle | ドラッグハンドル | |
| editor | エディタ | |
| editor state | エディタの状態 | ProseMirror の `EditorState` クラスはコードのまま |
| event | イベント | |
| extension | 拡張機能 | |
| floating menu | フローティングメニュー | |
| focus | フォーカス | |
| getting started | はじめに | |
| hard break | 強制改行 | |
| headless | ヘッドレス | 見た目を持たず、UI を自分で作る前提の設計 |
| heading / paragraph | 見出し / 段落 | |
| hook | フック | React のフック |
| input rule / paste rule | 入力ルール / 貼り付けルール | |
| keyboard shortcut | キーボードショートカット | |
| install / usage / settings / source code | インストール / 使い方 / 設定 / ソースコード | 拡張機能ページの見出し |
| leaf node | リーフノード | |
| list item | リスト項目 | |
| migration / migrate | 移行 / 移行する | |
| mark | マーク | |
| mark view | マークビュー | |
| node | ノード | |
| node view | ノードビュー | |
| optional | 省略可 | |
| option(s) | オプション | |
| parameters / returns | パラメーター / 戻り値 | API の小見出し |
| parse / serialize | パース / シリアライズ | |
| placeholder | プレースホルダー | |
| plugin | プラグイン | |
| prefix | 接頭辞 | |
| Pro extensions | Pro 拡張機能 | 有料プランの拡張機能 |
| render | レンダリング | React の再描画は「再レンダリング」 |
| rich text editor | リッチテキストエディタ | |
| schema | スキーマ | |
| selection | 選択範囲 | クラス名の `Selection` はコードのまま |
| SSR (server-side rendering) | SSR（サーバーサイドレンダリング） | |
| storage | ストレージ | 拡張機能の `storage` |
| textblock | テキストブロック | |
| token / tokenizer | トークン / トークナイザー | |
| toolbar | ツールバー | |
| transaction | トランザクション | |
| undo / redo | 元に戻す / やり直す | |
| update strategy | 更新方式 | |
| browser / library / container / utility | ブラウザ / ライブラリ / コンテナ / ユーティリティ | 末尾の長音は付けない（エディタに合わせる） |
