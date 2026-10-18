# カスタムマークビューを作る

> 原文: [https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views](https://tiptap.dev/docs/editor/extensions/custom-extensions/mark-views)

[ノードビュー](../node-views/index.md) がノードをレンダリングするのに対し、マークビューはマークをレンダリングします。ノード特有の複雑さを扱わなくてよいぶん、マークビューのほうが少しシンプルで、API も簡単です。

マークビューはエディタ内での体験を良くするのに最適ですが、読み取り専用の Tiptap インスタンスでも使えます。マークビューは意図的に HTML 出力と切り離されているので、エディタ内の体験 _と_ 出力の両方を自由に制御できます。

### JavaScript/Vue/React をレンダリングする

では、実際の JavaScript/Vue/React のコードをレンダリングしたい場合はどうすればよいでしょうか。その場合は [Static Renderer](../../../api/utilities/static-renderer.md) を使います。このユーティリティを使うと、Editor インスタンスなしでコンテンツを HTML、Markdown、React コンポーネントとしてレンダリングできます。
