# TypeScript で使う

> 原文: [https://tiptap.dev/docs/guides/typescript](https://tiptap.dev/docs/guides/typescript)

Tiptap のコードベースは、すべて TypeScript で書かれています。TypeScript を知らなくても、使ったことがなくても心配はいりません。使う必要はありません。

TypeScript は、JavaScript に型を加えて拡張したものです（名前の由来もここにあります）。素の JavaScript にはない新しい構文が加わります。この構文はブラウザで実行する前に取り除かれますが、その工程であるコンパイルは、バグを早く見つけるのに役立ちます。関数に正しい型のデータを渡しているかをチェックしてくれるからです。大きく複雑なプロジェクトでは、これがとても役に立ちます。コードを利用者に届ける前に、多くのバグに気づけるということです。

**とはいえ、プロジェクトで TypeScript を使っていなくても問題ありません。** Tiptap はそのまま使えますし、Tiptap の API の入力補完もちゃんと効きます（コードエディタが対応していれば、ですが、ほとんどは対応しています）。

プロジェクトで TypeScript を使っていて Tiptap を拡張したい場合は、知っておくとよい型が2つあります。

## 型

### オプションの型

拡張機能のデフォルトのオプションを拡張したり作ったりするには、独自の型を定義します。例を示します。

```ts
import { Extension } from '@tiptap/core'

export interface CustomExtensionOptions {
  awesomeness: number
}

const CustomExtension = Extension.create<CustomExtensionOptions>({
  addOptions() {
    return {
      awesomeness: 100,
    }
  },
})
```

### ストレージの型

拡張機能のストレージに型を付けるには、ストレージの型を定義し、2番目の型引数として渡します。例を示します。

```ts
import { Extension } from '@tiptap/core'

export interface CustomExtensionStorage {
  awesomeness: number
}

// Storage インターフェースを拡張し、`editor.storage.customExtension` を `CustomExtensionStorage` 型にする
declare module '@tiptap/core' {
  interface Storage {
    customExtension: CustomExtensionStorage
  }
}

// ストレージの型を2番目の型引数として渡して拡張機能を作る
// これで `this.storage` が `CustomExtensionStorage` 型になる
const CustomExtension = Extension.create<{}, CustomExtensionStorage>({
  name: 'customExtension',

  addStorage() {
    return {
      awesomeness: 100,
    }
  },
})
```

これで、拡張機能の外でストレージを使うときも型安全になります。

```ts
const customStorage = editor.storage.customExtension
customStorage.awesomeness = 200 // ✅
```

### コマンドの型

コアのパッケージは `Command` 型もエクスポートしています。コードで定義するすべてのコマンドに、この型を付ける必要があります。例を示します。

```ts
import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customExtension: {
      /**
       * このコメントは入力補完に表示される。
       */
      yourCommand: (someProp: any) => ReturnType
    }
  }
}

const CustomExtension = Extension.create({
  addCommands() {
    return {
      yourCommand:
        (someProp) =>
        ({ commands }) => {
          // …
        },
    }
  },
})
```

基本的にはこれだけです。残りはすべて Tiptap が自動で処理します。
