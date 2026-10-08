# Django プロジェクト構成方針

## 前提

- Django の責務は **API を提供すること**(画面は持たない)
- API は **BFF(Backend for Frontend)** の考え方で、画面・ユースケース単位に設計する
- `accounts` / `organizations` / `audit` は **内部処理専用** で、ドメイン単位の API は持たない
- API として提供するのは `orders` / `schedules` などの業務機能

## ファイル構成

```
project-root/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── prod.py
│   ├── urls.py               # api/v1/ と admin/ のみ
│   ├── asgi.py
│   └── wsgi.py
├── apps/                     # ドメイン層(APIを持たない)
│   ├── accounts/             # User, Profile, 認証
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── services.py       # 書き込み系ロジック
│   │   ├── selectors.py      # 読み取り系クエリ
│   │   ├── migrations/
│   │   └── tests/
│   ├── organizations/        # Department, 所属関係(同じ構成)
│   ├── audit/                # AccessLog, 操作履歴(同じ構成 + middleware.py)
│   ├── orders/               # 同じ構成
│   └── schedules/            # 同じ構成
├── api/                      # BFF層(画面・ユースケース単位)
│   ├── permissions.py
│   ├── pagination.py
│   ├── exceptions.py
│   └── v1/
│       ├── urls.py
│       ├── auth/             # ログイン、/me など
│       │   ├── serializers.py
│       │   ├── views.py
│       │   └── urls.py
│       ├── orders/
│       ├── schedules/
│       └── dashboard/        # 複数ドメインを集約する画面
├── common/                   # 共通の基底モデル・ユーティリティ
├── manage.py
├── pyproject.toml
└── .env.example
```

## 設計ルール

### 層と依存関係

- 依存は **`api → apps` の一方向**。ドメインアプリは `api` を import しない
- ドメインアプリ間の依存は **`audit → accounts ← organizations`**。`accounts` は他アプリに依存しない

### API層(`api/`)

- **ビジネスロジックを書かない**。views は `services` / `selectors` を呼び、画面の形に整えて返すだけ
- **ドメインではなく画面・ユースケースで分ける**。ドメイン名と一致してもよいが、`dashboard/` のような集約エンドポイントもここに置く
- serializers は **画面向けのレスポンス形状** として定義し、モデル構造をそのまま公開しない
- ログインやユーザー情報など画面が必要とするものは、`api/v1/auth/` から accounts の services を呼んで提供する

### ドメイン層(`apps/`)

- 各アプリは `models` / `services` / `selectors` / `admin` / `tests` で構成する
- 書き込みは `services.py`、複雑な読み取りは `selectors.py` に置く
- API 専用のため、各アプリに `views.py` / `urls.py` / `forms.py` / `templates/` は置かない

### accounts 関連の分割方針

| アプリ | 内容 | 理由 |
|---|---|---|
| `accounts` | User, Profile, 認証 | カスタムユーザーモデルは後から移せないため固定 |
| `organizations` | Department, 所属関係 | ユーザーとは別のライフサイクルで変更される |
| `audit` | AccessLog, 操作履歴 | 追記のみ・大量データで、保存期間など運用要件が異なる |

- アクセスログは `audit/middleware.py` で記録し、API 層から明示的に呼ばない

### 設定

- settings は環境別(`base` / `dev` / `prod`)に分割する
- 秘密情報は `.env` で管理し、`.gitignore` に入れる。代わりに `.env.example` をコミットする
- admin を使う場合は `STATIC_ROOT` の設定を残す

## URL 構成

`config/urls.py`

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("api.v1.urls")),
]
```

`api/v1/urls.py`

```python
urlpatterns = [
    path("auth/", include("api.v1.auth.urls")),
    path("orders/", include("api.v1.orders.urls")),
    path("schedules/", include("api.v1.schedules.urls")),
    path("dashboard/", include("api.v1.dashboard.urls")),
]
```

## アプリの作成手順

```bash
mkdir apps/schedules
python manage.py startapp schedules apps/schedules
```

作成後に以下を行う。

1. `apps.py` の `name` を `"apps.schedules"` に修正し、`INSTALLED_APPS` に登録
2. 不要な `views.py` を削除
3. `services.py` と `selectors.py` を追加
4. `tests.py` を `tests/` フォルダ(`__init__.py` 付き)に置き換え

アプリが増えて手作業が負担になった場合は、`startapp --template` による雛形の導入を検討する。

## 移行時の注意

- 部署・アクセスログを `accounts` から別アプリへ移す際は **モデル移動のためマイグレーションが必要**
- テーブル名を維持する場合は `db_table` を指定し、`SeparateDatabaseAndState` を使うとデータを移動せずに済む
- 移行はアプリ単位で段階的に進める
