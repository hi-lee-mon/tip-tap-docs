# エディタをアクセシブルにする方法

> 原文: [https://tiptap.dev/docs/guides/accessibility](https://tiptap.dev/docs/guides/accessibility)

Tiptap は誰もが使えるエディタを目指しています。ただし、Tiptap はヘッドレスなエディタで、この目標とは相性がよくありません。インターフェースを提供していないため、エディタのアクセシビリティを確保するのは利用者側の役割になります。そのための指針を以下にまとめました。

## アクセシブルなエディタのデモ

[デモを開く](https://embed.tiptap.dev/preview/Examples/Accessibility)

## 指針

エディタをアクセシブルにするための指針です。これですべてを網羅しているわけではありません。

### キーボードでの操作

エディタのすべての機能をキーボードで使えるようにしてください。エディタ内の移動、テキストの選択、メニューの操作、エディタの各機能の利用がこれに含まれます。
上のデモでは、次の操作でエディタをキーボードだけで操作できます。

- `Tab` でエディタ内にフォーカスする
- `Alt + F10` でエディタのツールバーにフォーカスする
  - 矢印キーでツールバー内を移動する
  - `Enter` でメニュー項目を選ぶ
  - `Tab` または `Esc` でエディタのコンテンツに戻る
- `Shift + 矢印キー` でテキストを選択する
  - `Tab` でテキスト選択メニューに移動する
  - `Enter` でメニュー項目を選ぶ
  - `Tab` または `Esc` でエディタのコンテンツに戻る
- `Enter` で新しい段落を作る
  - `Tab` でコンテンツ挿入メニューに移動する
    - 矢印キーでツールバー内を移動する
    - `Enter` でメニュー項目を選び、コンテンツを挿入する
    - `Tab` または `Esc` でエディタのコンテンツに戻る
- そのほか、[キーボードショートカット](../editor/core-concepts/keyboard-shortcuts.md)に記載したエディタのキーボードショートカットすべて

### セマンティックなマークアップと ARIA ロール

Tiptap の標準の拡張機能は、どれもセマンティックなマークアップを出力します。つまり、スクリーンリーダーが理解しやすい HTML をエディタが生成します。

スクリーンリーダーをさらに助けるには、エディタとメニューに適切な ARIA ロールを付けてください。例を挙げます。

- エディタには `role="textbox"` を付ける
- ツールバーには `role="toolbar"` を付ける
- メニューには `role="menu"` を付ける
- メニュー項目には `role="menuitem"` を付ける

### インターフェース

インターフェースには、はっきりしたコントラストと、十分な大きさのクリック領域が必要です。現時点では Tiptap はインターフェースを提供していないため、この部分は完全に利用者側に任されています。

### 注意点

アクセシビリティに取り組む中で、知っておくべき注意点がいくつか見つかりました。

#### VoiceOver がブロック要素をまたいで単語をつなげて読む

macOS の VoiceOver は、ブロック要素をまたいで単語をつなげて読むことがあります。スクリーンリーダーに頼るユーザーにとって、思いがけない読み上げになりかねません。

たとえば、次の HTML 構造を考えます。

```html
<h1>Heading</h1>
<p>Paragraph</p>
```

VoiceOver はこれを "Heading Paragraph" ではなく "HeadingParagraph" と読みます（空白がない点に注目してください）。これを直すには、各ブロック要素の後ろにゼロ幅スペースを追加します。

```css
.tiptap {
  h1::after,
  h2::after,
  h3::after,
  h4::after,
  h5::after,
  h6::after,
  p::after {
    content: '\200B';
  }
}
```

#### キーボードトラップ

キーボードトラップとは、ユーザーがキーボードで特定の要素から抜け出せなくなる状況のことです。キーボードで開けるモーダルやメニューがあると、これが問題になります。こうした要素からは、いつでも抜け出せるようにしてください。

### 執筆支援（任意）

任意の機能として執筆支援があれば、意味的に正しいコンテンツを書く助けになります。たとえば、見出しレベルの誤った使い方を指摘する機能です。こうした支援をコア開発者が提供できれば、多くのアプリケーションのコンテンツを改善する手助けになるはずです。

## 参考資料

| ドキュメント | 節 | 見出し |
| -------- | ------- | -------------------------------------------------------------------------------------- |
| WCAG 3.0 | 7.1     | [Text Alternatives](https://www.w3.org/TR/wcag-3.0/#text-alternatives)                 |
| WCAG 2.1 | 1.1.1   | [Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content)       |
| WCAG 2.1 | 2.1     | [Keyboard Accessible](https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible) |
| WCAG 2.1 | 2.1.1   | [Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard)                       |
| WCAG 2.1 | 4.1.1   | [Parsing](https://www.w3.org/WAI/WCAG21/Understanding/parsing)                         |
| WCAG 2.1 | 4.1.2   | [Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)       |
| WCAG 2.1 | 2.1.2   | [No Keyboard Trap](https://www.w3.org/TR/WCAG21/#no-keyboard-trap)                     |
