# Tiptap の Pro 拡張機能を組み込む方法

> 原文: [https://tiptap.dev/docs/guides/pro-extensions](https://tiptap.dev/docs/guides/pro-extensions)

Tiptap の Pro 拡張機能は、バージョン管理や AI によるコンテンツ生成といった高度な機能を Tiptap エディタに加えます。Pro 拡張機能を使うには Tiptap のアカウントが必要です。Snapshots、Comments、AI Toolkit の一部の機能など、特定の拡張機能には有効なサブスクリプションも必要です。

Tiptap の Pro 拡張機能と Cloud 拡張機能を使うと、共同編集、バージョン履歴、コメント、AI による編集支援などの機能が使えるようになります。インストールは、個人用のアクセストークンを使って Tiptap のプライベート NPM レジストリから行います。

> [!WARNING]
> **セキュリティに関する警告**
>
> 認証トークンは、不正に使われないようパスワードと同じように扱ってください。Tiptap のユーザーにはそれぞれ、
> 有効期限のない一意の認証トークンがあります。CI/CD 用には専用のユーザーを作ることをおすすめします。

## アクセストークンを取得する

1. Tiptap のアカウントにサインインする（または[新規登録する](https://cloud.tiptap.dev/register)）
2. Tiptap のプランの[トライアルを始めるか、購読する](https://cloud.tiptap.dev/v2/billing)
3. [My features → Pro Extensions](https://cloud.tiptap.dev/v2/features/pro-extensions) から個人用の NPM トークンをコピーする

## プロジェクトごとに認証を設定する

プロジェクトのルートにあるパッケージマネージャーの設定ファイルに、レジストリとトークンを追加します。

> [!NOTE]
> **ヒント**
>
> 認証情報をコミットしないよう、`TIPTAP_PRO_TOKEN` は環境変数として参照してください。

### npm、pnpm、Yarn Classic

.npmrc を作成または更新します。

```
@tiptap-pro:registry=https://registry.tiptap.dev/
//registry.tiptap.dev/:_authToken=${TIPTAP_PRO_TOKEN}
```

### Yarn Modern（Yarn 2 以降）

.yarnrc.yml を作成または更新します。

```
npmScopes:
 tiptap-pro:
   npmAlwaysAuth: true
   npmRegistryServer: "https://registry.tiptap.dev/"
   npmAuthToken: ${TIPTAP_PRO_TOKEN}
```

`.npmrc` または `.yarnrc.yml` を `.gitignore` に追加します。

> [!TIP]
> **警告**
>
> 設定ファイルに認証トークンを直接書いている場合、認証情報の漏えいを防ぐためにこの手順は欠かせません。

プロジェクトの認証を設定すれば、Pro 拡張機能もほかのエディタの拡張機能と同じようにインストールできます。

環境変数を使っている場合は、インストール時に認証トークンを渡します。

```
TIPTAP_PRO_TOKEN=actual-auth-token npm install --save @tiptap-pro/extension-comments
```

## グローバルに認証を設定する

ユーザー単位のパッケージマネージャーの設定ファイルを更新すると、**すべての**プロジェクトの認証を一度に設定できます。CI/CD の環境で便利です。

1. Tiptap のアカウントにサインインする（または無料のアカウントを作る）
2. Tiptap のプランの[トライアルを始めるか、購読する](https://cloud.tiptap.dev/v2/billing)
3. （任意）CI/CD パイプライン用に[チームメンバーを招待する](https://cloud.tiptap.dev/v2/team/members)
4. [My features → Pro Extensions](https://cloud.tiptap.dev/v2/features/pro-extensions) から個人用の NPM トークンをコピーする

### npm または Yarn Classic

```bash
npm config set "@tiptap-pro:registry" https://registry.tiptap.dev/
npm config set "//registry.tiptap.dev/:_authToken" actual-auth-token
```

### Yarn Modern

```bash
yarn config set --home npmScopes.@tiptap-pro.npmRegistryServer "https://registry.tiptap.dev/"
yarn config set --home npmScopes.@tiptap-pro.npmAlwaysAuth "true"
yarn config set --home npmScopes.@tiptap-pro.npmAuthToken "actual-auth-token"
```

### pnpm

```bash
pnpm config set --global "@tiptap-pro:registry" https://registry.tiptap.dev/
pnpm config set "//registry.tiptap.dev/:_authToken" actual-auth-token
```

これで、どのリポジトリでも Tiptap の Pro 拡張機能をインストールできます。

```
npm install --save @tiptap-pro/extension-comments
```
