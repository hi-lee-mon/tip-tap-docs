# Tiptap エディタを組み込む

> 原文: [https://tiptap.dev/docs/editor/getting-started/overview](https://tiptap.dev/docs/editor/getting-started/overview)

必要な機能だけを備えた、プロダクトに合うリッチテキストエディタを作れます。Tiptap は、実績のある ProseMirror ライブラリを、特定のフレームワークに依存しないモダンな API で包んだものです。あらゆる用途に向けた拡張機能と機能がそろっています。

## Tiptap とは

Tiptap はヘッドレスなリッチテキストエディタのフレームワークです。自分や顧客のニーズに完全に合わせた独自のエディタを作れます。
土台は、Web 上のリッチテキストエディタを作るための、実戦で鍛えられたライブラリ ProseMirror です。
内部では [イベント](../api/events.md)、[コマンド](../api/commands/index.md)、
[拡張機能](../extensions/overview.md)を多用し、エディタを作るための柔軟で強力な API を提供しています。

## Tiptap を選ぶ理由

- **最初からモジュール式:** 太字やリンクから、複雑な表やスラッシュメニューまで、必要な拡張機能だけを追加できます。バンドルを小さく保ち、スキーマを管理しやすくできます。
- **ヘッドレスが前提:** Tiptap は React、Vue、Svelte、素の JS など、どんなフレームワークにも組み込めます。React の [UI Components とテンプレート](https://tiptap.dev/docs/ui-components/getting-started/overview)と組み合わせることもできます。
- **オープンソースと Pro 拡張機能:** Tiptap のオープンソース部分は、MIT ライセンスで GitHub に公開されています。コメントや AI コマンドなどの高度な機能が必要になったら、有料の Tiptap 拡張機能を追加できます。

Tiptap を使い始めたいなら、[インストールガイド](install/index.md)に従って最初のエディタをセットアップしてください。

## 既製のコンポーネントとテンプレートで素早く始める

既製の React コンポーネントのライブラリと、機能のそろったテンプレートを組み込めば、完成度の高いエディタを手に入れ、そこからカスタマイズできます。

- [テンプレート](https://tiptap.dev/docs/ui-components/templates/simple-editor) — よく使う機能を備えた構築済みのエディタで、すぐに始められます。
- [コンポーネント](https://tiptap.dev/docs/ui-components/components/overview) — すでに Tiptap を使っているなら、必要な部品だけを組み込めます。

### エディタを拡張する

Tiptap エディタは、オープンソースの拡張機能や Pro 拡張機能で拡張できます。Tiptap のスイートはより高度な機能を加えるもので、[Tiptap Cloud のダッシュボード](https://cloud.tiptap.dev/v2/billing)から30日間の無料トライアルを始められます。

- まずは [`StarterKit`](../extensions/functionality/starterkit.md) から。基本的なマークとノードがひととおりそろったセットです。
- [機能の拡張機能](../extensions/functionality/index.md)を追加する。文字数カウンター、プレースホルダー、履歴など。
- [コンテンツの拡張機能](../extensions/overview.md)を追加する。画像、表、図、独自のノードなど。
- [独自の拡張機能のガイド](../extensions/custom-extensions/index.md)に従って、自分で作る。

### バージョン履歴やコメントを追加したり、AI エージェントを組み込んだりする

Tiptap のアカウントを作ってダッシュボードを開き、30日間のトライアルを始めると、Tiptap の有料機能をすべて試せます。

- **30日間のトライアル:** クレジットカードは不要です。
- **エディタの機能:** すべての Pro 拡張機能と Cloud 拡張機能を組み込めます。
- **すべての有料機能:** 共同編集、コメント、バージョン履歴などを試せます。
- **AI 機能:** エディタに AI 機能を組み込めます。

[トライアルを始める](https://cloud.tiptap.dev/register)

## エディタの資料

- [Tiptap エディタをセットアップして設定するには](configure.md) — First Steps / Editor
- [Pro 拡張機能を組み込むには](../../guides/pro-extensions.md) — First Steps / Editor, Collaboration
- [エディタで共同編集できるようにするには](https://tiptap.dev/docs/collaboration/getting-started/install) — First Steps / Editor, Collaboration
- [ヘッドレスな Tiptap エディタにスタイルを付けるには](style-editor/index.md) — Styling / Editor

[ガイドを見る](https://tiptap.dev/docs/guides)
