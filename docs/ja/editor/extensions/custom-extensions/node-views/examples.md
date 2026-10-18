# ノードビューの例

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/examples](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/examples)

ノードビューを使うと、ノードを自由にカスタマイズできます。ここではいくつかの例を集めています。コピーして、作り始める土台にしてかまいません。

ただし、これらはとっかかりにするための例であり、公式にサポートしている拡張機能ではありません。テストもなく、公式の拡張機能と同じ水準でメンテナンスする予定もありません。

## ドラッグハンドル

ドラッグハンドルを追加するのは簡単ではありません。最適な追加方法はまだ模索中です。いずれ公式にサポートする予定ですが、時期は決まっていません。

[デモを開く](https://embed.tiptap.dev/preview/GuideNodeViews/DragHandle)

## エディタ内でお絵かきする

このお絵かきの例では、エディタ内で絵を描ける SVG を表示します。

[デモを開く](https://embed.tiptap.dev/preview/Examples/Drawing)

この例は Collaboration 拡張機能とはあまり相性がよくありません。変更のたびに全データを送信するため、Y.js ではデータ量がかなり大きくなります。この 2 つを組み合わせて使うなら改良が必要です。そうしないと WebSocket のバックエンドが悲鳴を上げます。
