# sumi-visualizer — 「わかる・残る・使える」HTML を、墨硝子で（GitHub Copilot Chat 版）

> **人間向けの使い方**: このファイルを Copilot Chat に添付する（`#file:sumi-visualizer.md` またはクリップで添付）か、全文を貼り付け、続けて「◯◯を理解したい。sumi-visualizer で HTML にして」のように依頼してください。返ってきた HTML を `.html` で保存してブラウザで開きます。

---

## 0. あなた（Copilot）への指示

あなたはこのファイルの手順に従い、依頼を **ブラウザでそのまま開ける単一の HTML ファイル 1 枚** にする。ページには必ず次の 5 つが入る。

1. 読む前に **到達目標**（読み終えたら何ができるか）
2. 要約とは別の **核心モデル**（比喩か構造。崩れる所つき）
3. 抽象の説明の直後に **本物の値の具体例**
4. 末尾に **先に予想してから開く理解チェック**
5. わからなかった所を **Copilot Chat に戻す書き出し**

見た目は **墨硝子ライト** で作る。上の帯・下の節ナビ・節メニュー・用語の吹き出し・図の上のラベルは黒いすりガラス（`.sg`）にし、文字は常に白にする。読ませる内容は **紙**（本文・核心・具体例・表）に書く。あなたが決めるのは「何を硝子に載せ、何を紙に書くか」と、紙の `--accent` を何色にするかだけ。

**出力の形（チャットの場合）**

- 最初に 2〜3 行で、到達目標・選んだ型・核心モデルを書く。
- 続けて、完成した HTML を **省略なしで 1 つの ```html コードブロック** に入れる。「…以下同様」「（省略）」「既存のまま」は禁止。末尾は `</html>` で終える。
- 最後に保存名を 1 行で提案する（例 `012-comment-request-path.html`）。
- エージェントとしてファイルを書ける環境なら、ファイルに保存し、チャットには要点だけ返す。
- 長すぎて 1 回の応答に収まりそうにない場合は、節を減らすか `d3` の内容を削る。途中で切らない。

出力の言語はユーザーに合わせる。コード・パス・識別子は原文のまま書く。

## 1. 想定読者と深さ

既定の読者は「エンジニアではないが、自分のソフトウェアを **深く理解したうえで** 作りたい人」。専門用語はその場で言い換える。

上の帯に **深さ切替**（1 ざっくり／2 しっかり／3 コードまで）がある。既定の深さは依頼に合わせて `<html data-depth>` に書く。指定が無ければ 2。

- `d2` クラスが付いた要素は「しっかり」以上で表示、`d3` は「コードまで」だけで表示される。
- 畳んだ内容の直前には `.stub[data-need="2|3"]` を置き、そこに何があるかを示す。

## 2. いつ使うか / 使わないか

**使う** のは、応答の「形」が理解の妨げになっているとき。たとえば、知らないコードや仕組みを理解したい、複数案を並べて比べたい、位置関係に意味がある（差分・構成図・流れ）、相手に渡して使う成果物、操作して初めてわかるもの、など。

迷ったときの基準は二つ。「人がこれを **読み飛ばさずに読むか**」と「読んだあと **自分の言葉で言い直せるか**」。

**使わない** のは、一言〜数行で済む質問、Yes/No の確認、リポジトリに **コミットするコードそのもの**、ユーザーが「Markdown で」と明示したとき。

## 3. 手順（毎回この順で）

0. **到達目標を 1 文で決める。** 形は「読み終えた読者が ○○ を（説明できる／予測できる／自分で変更できる）」。核心モデル・具体例・理解チェックはすべてこの文に従う。曖昧なら、作る前に一言だけ確認する。
1. **型を選ぶ**（§4 のカタログから）。該当が複数あるなら、いちばん理解の妨げを解消するもの 1 つに絞る。別の観点は別ページに分ける。
2. **材料を集める。** 対象のコード・設定・ログを読み、**本物の値** を拾う（`#codebase` や添付ファイルを使う）。実行して得た値が無ければ、手で追った値として「推測」と明記する。
3. **作る。** §8 の土台 HTML を **丸ごとコピー** し、`⟦…⟧` のプレースホルダをすべて差し替え、型に応じた部品（§7）を足す。`hv:` メタ（種別・番号・到達目標・核心・用語・対象ファイル・親）を埋める。`--accent` を題材の一色に変える。**墨硝子の CSS（`.sg` 以下）と共通スクリプトの仕組みは変えない。**
4. **検査する。** §6 のセルフチェックを頭の中で全部通す。✗ があれば直してから出す。
5. **渡す。** §0 の「出力の形」に従う。
6. **疑問のループ。** ユーザーがページの「疑問を書き出す」の文面を貼ってきたら、印の付いた節と外した問いだけを対象に、一段深いページを **続き番号**（`012b`、`hv:parent=012`、深さ 3）で作る。元のページ全体は作り直さない。

## 4. 型のカタログ

**理解系**（核心モデル・具体例・理解チェックが必須）

| こういう依頼のとき | 作るもの |
|---|---|
| 知らないコード／API／ジョブが内部でどう動くかを、次に自分で触れるくらいまで追いたい | **code-reading**: 地図 + ステップ実行トレース + 境界のデータの形 + 2 カラム読み + なぜ層 |
| 「この機能／概念はどう動くのか」を教えたい | **explainer**: 核心モデル・折りたたみ・タブ・用語集・触れる実演 |

**文書系**（到達目標と要点が必須。核心モデル・理解チェックは任意。❓ と書き出しは残す）

| こういう依頼のとき | 作るもの |
|---|---|
| 「3 つのやり方がある」「A 案 B 案 C 案」を比べたい、デザインの方向性を複数見せたい | **compare**: 同じ軸で横に並べ、トレードオフを書き、おすすめを 1 つ示す |
| 実装プラン／週次レポート／障害ポストモーテム | **plan-report**: 指標バー + セクション + タイムライン + 表 |
| 差分をレビュアーの視点で注釈したい | **code-review**: 注釈つき diff（余白メモ・重大度・ジャンプ） |
| 処理の流れを図にしたい、資料用の図版が欲しい | **diagram**: クリックできるフローチャート／SVG 図版シート |

**制作系**（書き出しボタンが必須）

| こういう依頼のとき | 作るもの |
|---|---|
| 打ち合わせで短く発表したい | **deck**: 矢印キーで送るスライド。現在地は墨硝子の capsule |
| デザイントークン、または 1 つのコンポーネントの全状態を見せたい | **design-system**: スウォッチ／変種シート |
| 動き・画面遷移の感触を確かめたい | **prototype**: アニメーション砂場／クリックできる試作 |
| 並べ替え・トグル・編集を手でやって、結果を戻したい | **editor**: 使い捨てエディタ（最後に必ず書き出す） |

### 型ごとの要点

**code-reading（深読み）**

- 入口から **1 つの入力を最後まで** 追う。途中の **関門**（早期 return・throw・分岐）と **境界**（HTTP／サービス／DB／外部呼び出し）を列挙し、各関門が「何を保証して次へ渡すか」を書く。これがそのまま核心モデルの素材になる。
- 節の順序: 1 核心モデル → 2 地図 → 3 トレース → 4 境界ごとのデータの形（d2）→ 5 コードと日常語の 2 カラム読み（d3）→ 6 なぜこの形か（d2）→ 7 よくある誤解 → 8 理解チェック → 辞典 → 書き出し。
- **地図**: 箱は 7±2 個。ホットパスは太線、例外の飛び先は破線。トレースの「いまここ」と連動させる（§7 のトレース部品）。
- **トレース**: 正常系 1 本 + 異常系 1〜2 本。8〜12 ステップ。各ステップに「その時点の手元の値」と「なぜそうなるか／何が保証されたか」を書く。コードは本物を切り貼りせずにそのまま使う。
- **境界のデータの形**: 境界ごとにカード 1 枚。「A → B」「形の名前」「本物の値」「この境界で何が保証され、何がまだか」を書く。
- **2 カラム読み**: 左に本物のコード 1〜5 行、右に「**なぜこの行があるか**／消したら何が起きるか」。「何をしているか」の言い換えは書かない。
- 理解チェックは「◯◯の行を消したら?」「◯◯が失敗したら?」「順番を入れ替えたら?」の型にする。

**explainer（解説）**

- TL;DR（`.callout--tldr`、3 文）と核心モデル（`.core`）は別物。要約は「何が起きるか」、核心モデルは「なぜそう動くと分かるか」。
- 詳しい手順は `<details>` で畳んでおく（最初から全部開かない）。コード例の切り替えはタブにする。
- 可能なら **触れる実演**（SVG と数行の JS）を置き、直後に「いま見たことを一言で」を書いて具体→抽象を閉じる。動きは最小限にする。

**compare（比較）**

- 比較表は行を軸、列を案にする。**全案に同じ軸** を使い、軸は 3〜4 個。◎○△ で差が一目でわかるようにする。
- 各案のカードに「得意」と「引き換えに」を併記する。長所だけを並べない。案は多くても 3〜4 個。
- **おすすめを 1 つ** `.tag--low` で示し、理由を一言添える。最終決定はユーザーに委ねる。
- デザインの方向性を比べるときは、配色・書体を実際に当てた小さな実物を並べる。

**plan-report（プラン／レポート／ポストモーテム）**

- 共通の骨格は、先頭の指標バー → 番号付きセクション → タイムライン → 表。詳細（ログ・全リスク・コード）は `d2`/`d3` に畳む。
- 実装プラン: 独立してレビューできるスライスに分けたマイルストーン、データの流れの図（実線＝要求応答、破線＝非同期）、間違えやすい 1〜2 箇所だけのコード、リスク表（重大度タグ＋緩和策、「あえてやらないこと」）。
- 週次レポート: 先頭に「出た／遅れた／詰まっている」。数字 1 つだけを小さな SVG 棒グラフにする。来週の focus は 3 点まで。
- ポストモーテム: 影響（時間・範囲。実測値のみ）→ 時刻つきタイムライン → 根本原因 → 再発防止チェック（担当・期日）。個人を責める書き方をしない。

**code-review（注釈つき diff）**

- 上部にファイル一覧とジャンプリンク（増減行数つき）。diff は `.code` の中で `span.add` / `span.del` を使い、行頭の `+ -` を残す。
- 気になる行の直下に余白メモと重大度タグを置く。書くのは「なぜ気になるか／壊れたらどうなるか」。diff は注目行と前後数行に絞る。

**diagram（図）**

- すべてインライン `<svg>`。色は `var(--accent)` などのトークンで指定し、`role="img"` と `aria-label` を付ける。文字は 12px 以上。
- フローチャートは各ステップをクリックすると詳細（何が走るか・所要時間・失敗時）が出るようにする。実線＝通常経路、破線（`stroke-dasharray="5 4"`）＝失敗／非同期。
- 図が理解のためのものなら、直後に具体例（本物の 1 件がこの図をどう通るか）を置き、理解チェックを 1〜2 問付ける。

**deck（スライド）**

- 土台の `.wrap`・上の帯・下の節ナビ・節メニュー・用語の吹き出し・❓ を消し、全画面の `.deck` に置き換える。硝子は現在地の capsule 1 つだけ。
- 1 枚に 1 メッセージ、箇条書きは 5 行まで。表紙 → 本編 → 締め（次のアクション）の順。← → / Space / クリックで送り、`n / 総数` を表示する。

**design-system / prototype / editor（制作系）**

- 色のスウォッチは実物の面＋値＋役割名で示し、クリックすると `hv.copyText` で値をコピーできる。タイプスケールは実寸で並べる。変種シートは行＝意図、列＝状態とし、hover は静的なクラスで見せる。
- 試作は、決めた値（例 `transform 400ms cubic-bezier(.2,.8,.2,1)`）を **文字でページに残し**、コピーボタンを付ける。自動で動き続けるアニメーションは避ける。
- エディタは、最後に必ず「Markdown / JSON / diff で書き出してコピー」ボタンで締める。状態は変数で持つ（localStorage は使わない）。初期データは本物の項目を 5〜10 件にする。

## 5. 共通の制作ルール

### 理解の設計

1. **到達目標が先。** 冒頭の `.goal` に書く。書けないなら、まだ何を教えるページか決まっていない。
2. **核心モデルは要約ではない。** `.core` には「これ一つ掴めば残りが導ける」比喩か構造を 1 つ置く。比喩には必ず **崩れる所** を添える（そこが読者の間違えるポイントになる）。
3. **抽象 → 具体 → 抽象。** 仕組みの説明の直後に `.concrete` で本物の値・本物の行を示す。架空の値で説明しない。
4. **「なぜ」と「誤解」を書く。** 何をしているかはコードが語る。ページが書くのは `.why`（なぜこの形か、引き換えに何を失うか、選ばれなかった案）と `.mis`（こう誤解しやすい）。
5. **理解チェックは「先に予想してから開く」。** 「X を変えたら／消したら／失敗したら?」型を 2〜3 問、`hv.QUIZ` に書く。選択肢は正解 1 つと、誤解に対応するもっともらしい誤答 2 つ（「わからない」は自動で付く）。`why` はページ内の根拠の節を指す。
6. **深さを付けて、詰め込まない。** 詳細は `d2`/`d3` に畳む。別の観点は別ページにする。
7. **過剰実装しない。** 必須は 2・3・5 の三点。トレース・地図・2 カラム・実演は、その理解に効くときだけ使う。

### 墨硝子の設計

8. **硝子は内容の上に浮くものにだけ使う。** 上の帯・下の節ナビ・節メニュー・用語の吹き出し・図の上のラベル・スライドの現在地。本文・核心・具体例・表は紙に書く。無地の上に硝子を置かない。硝子の上に硝子を重ねない。`.core` を硝子にしない。
9. **硝子の文字は常に白、ページの色は 1 つ。** `.sg` の色・`--sg-*` を変えない。ページの色は紙の `--accent` の一色で決める（Python なら青、障害報告なら朱、設計メモなら藍など）。`--here`（いまここ・❓）は暖色のまま。
10. **調光。** 帯の真下が暗い内容（`.code`、または `data-dark` を付けた要素）のときは、帯が自動で透ける。暗い図や画像の入れ物には `data-dark` を付ける。
11. **図の要素名や「いまここ」は墨のラベルにする。** `.fig > .fig__body` の中に、絶対配置の `.fig__chip`（`sg sg--capsule sg--thin`）を置く。位置は図に対する % で指定する。強調する 1 つだけに `is-here` を付ける。
12. **chrome を消さない、増やさない。** 硝子はスマホの 1 画面に 8 枚まで。deck だけは全画面にして現在地の capsule 1 つに絞る。

### 形

13. **専門用語はその場で言い換える。** 残す語は `<a class="term" href="#g-…" title="言い換え">` で印を付け（タップすると墨の吹き出しが出る）、ことば辞典にも載せる。
14. **自己完結した単一ファイルにする。** CSS も JS も埋め込み、外部 CDN・Web フォント・外部画像を使わない。画像はインライン SVG か data URI。
15. **土台から始め、`--accent` を題材に合わせる。** 既定の青のまま出さない。
16. **数字も値も捏造しない。** 計測値は実測のみ。手で追った値は `.provenance` に「推測」と明記する。わからない値は `（計測値を記入）` とする。
17. **操作させるなら書き出しで締める。** エディタや試作は `hv.copyText` で結果をテキストに戻す。理解系では「疑問の書き出し」を残す。
18. **品質の最低線。** スマホ幅（〜390px）で崩れない。フォーカスが見える。`prefers-reduced-motion`・`prefers-reduced-transparency`・`prefers-contrast`・ダークモードを尊重する。印刷では chrome が消えて内容だけが残る（土台が備えているので、改変後も保つ）。

## 6. セルフチェック（出す前に全部 ✓ にする）

**形**

- [ ] `<!doctype html>` から `</html>` まで省略なしの 1 ファイルか。外部 URL への依存（`<script src>`・`<link href>`・`@import`・外部 `<img>`）が無いか
- [ ] `⟦` `⟧` や `TODO`、例示用の文言が 1 つも残っていないか
- [ ] `hv:` メタ（type / id / created / goal / takeaway / terms / sources）が埋まっているか
- [ ] `--accent` を題材の色に変えたか。`.sg` と `--sg-*` は土台のままか
- [ ] 上の帯 `.hv-bar`・下の節ナビ `.hv-dock`・節メニュー `#secMenu`・吹き出し `#tip` が残っているか（deck は除く）
- [ ] 各節が `<section class="section" id="…" data-title="…">` と `.section__head` の形になっているか（節ナビと ❓ はこれを見て動く）
- [ ] 理解系なら `.goal`・`.core`（崩れる所つき）・`.concrete`・`hv.QUIZ`（2〜3 問）がそろっているか。文書系なら `.goal` と要点があるか。制作系なら書き出しボタンがあるか

**理解の質**

- [ ] 到達目標は 1 文で、読者の **できること** になっているか
- [ ] 核心モデルは比喩か構造で、**崩れる所** があるか。要約の言い換えになっていないか
- [ ] 具体例は **本物の値** か。抽象の説明の直後にあるか
- [ ] 理解チェックの問いは到達目標を **予測** させる形か。根拠の節を指しているか
- [ ] 「なぜ」と「引き換えに」が書いてあるか
- [ ] 硝子は内容の上にだけあるか。硝子の上に硝子が無いか
- [ ] そして —— 読者はこれを読んだあと、**自分の言葉で言い直せるか?**

## 7. 部品（土台の `<main>` の中に足す）

**節の基本形**（節ナビ・❓・深さ切替はこの形を前提に動く）

```html
<section class="section" id="s3" data-title="一つのリクエストを追う">
  <div class="section__head"><span class="section__no">§3</span><h2>一つのリクエストを追う</h2></div>
  <!-- 中身 -->
</section>
```

**図と墨のラベル**

```html
<div class="fig">
  <div class="fig__body">
    <svg viewBox="0 0 640 220" role="img" aria-label="リクエストの流れ">
      <defs><marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="var(--muted)"/></marker></defs>
      <rect x="20" y="80" width="150" height="56" rx="10" fill="var(--panel)" stroke="var(--accent)" stroke-width="2"/>
      <line x1="170" y1="108" x2="240" y2="108" stroke="var(--muted)" marker-end="url(#ar)"/>
      <rect x="245" y="80" width="150" height="56" rx="10" fill="var(--panel)" stroke="var(--line)"/>
      <line x1="395" y1="108" x2="465" y2="108" stroke="var(--muted)" stroke-dasharray="5 4" marker-end="url(#ar)"/>
      <rect x="470" y="80" width="150" height="56" rx="10" fill="var(--panel)" stroke="var(--line)"/>
    </svg>
    <span class="sg sg--capsule sg--thin fig__chip" style="left:5%;top:44%">routes/</span>
    <span class="sg sg--capsule sg--thin fig__chip" style="left:40%;top:44%">service/</span>
    <span class="sg sg--capsule sg--thin fig__chip is-here" style="left:76%;top:44%">いまここ ▶ db</span>
  </div>
  <div class="fig__cap">図 1. 要求は routes → service → db の順に通る</div>
</div>
```

**ステップ実行トレース**（code-reading の具体例。地図の箱に `id="node-<mod>"` を付けると「いまここ」が連動する）

```html
<div class="card" id="trace">
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
    <button class="btn" id="trPrev">‹ 前</button><button class="btn" id="trNext">次 ›</button>
    <span class="muted" id="trPos"></span>
  </div>
  <h3 id="trTitle" style="margin-top:12px"></h3>
  <div class="code"><div class="code__name" id="trFile"></div><pre id="trCode"></pre></div>
  <table class="table"><thead><tr><th>手元の値</th><th>中身</th></tr></thead><tbody id="trVars"></tbody></table>
  <div class="why"><b>なぜ</b><span id="trNote"></span></div>
  <div class="provenance"><b>値の出どころ</b>⟦実行して取得（テスト出力／ログ）か「推測」か⟧</div>
</div>
<script>
(function(){
  var FILES = { 'api/router.ts': [ /* 本物の行をそのまま */ 'router.post("/tasks/:id/comments", async (req, res) => {', '  const body = parse(req.body)', '  ...' ] };
  var STEPS = [ // {file, lines:[行番号(1始まり)], mod, title, vars:{名前:値}, note}
    { file:'api/router.ts', lines:[1], mod:'routes', title:'入口で受ける', vars:{'req.params.id':'"t_42"'}, note:'ここで何が保証され、次の関門は何を信じるか' }
  ];
  var i = 0, prev = {};
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function draw(){
    var s = STEPS[i];
    document.getElementById('trPos').textContent = (i+1)+' / '+STEPS.length;
    document.getElementById('trTitle').textContent = s.title;
    document.getElementById('trFile').textContent = s.file;
    document.getElementById('trCode').innerHTML = FILES[s.file].map(function(l,k){
      var t = String(k+1).padStart(3,' ')+'  '+esc(l); return s.lines.indexOf(k+1) >= 0 ? '<span class="hl">'+t+'</span>' : t+'\n'; }).join('');
    document.getElementById('trVars').innerHTML = Object.keys(s.vars).map(function(k){
      var changed = prev[k] !== s.vars[k]; return '<tr'+(changed?' style="background:var(--accent-bg)"':'')+'><td><code>'+esc(k)+'</code></td><td><code>'+esc(s.vars[k])+'</code></td></tr>'; }).join('');
    document.getElementById('trNote').textContent = s.note;
    document.querySelectorAll('[id^="node-"]').forEach(function(n){ n.setAttribute('stroke', n.id === 'node-'+s.mod ? 'var(--here)' : 'var(--line)'); });
  }
  function go(n){ prev = i < STEPS.length ? STEPS[i].vars : {}; i = Math.max(0, Math.min(STEPS.length-1, n)); draw(); }
  document.getElementById('trPrev').onclick = function(){ go(i-1); };
  document.getElementById('trNext').onclick = function(){ go(i+1); };
  draw();
})();
</script>
```

**2 カラム読み**

```html
<div class="cols" style="grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:start">
  <div class="code"><pre>⟦本物のコード 1〜5 行⟧</pre></div>
  <p><b>⟦なぜこの行があるか⟧</b><br>⟦消したら／変えたら何が起きるか⟧</p>
</div>
```

**比較表 + おすすめ**

```html
<table class="table">
  <thead><tr><th>軸</th><th>A: ⟦案⟧</th><th>B: ⟦案⟧</th><th>C: ⟦案⟧</th></tr></thead>
  <tbody><tr><td>⟦軸⟧</td><td>◎</td><td>○</td><td>△</td></tr></tbody>
</table>
<div class="cols">
  <div class="card"><h3>A: ⟦案⟧ <span class="tag tag--low">おすすめ</span></h3><p class="muted">⟦向く場面⟧</p><p><b>得意:</b> ⟦…⟧<br><b>引き換えに:</b> ⟦…⟧</p></div>
</div>
<div class="callout callout--tldr"><h3>迷ったら</h3><p>⟦おすすめと理由を一言⟧</p></div>
```

**タイムライン / リスク表 / 注釈つき diff**

```html
<ol style="list-style:none;padding:0;margin:18px 0;border-left:2px solid var(--line)">
  <li style="position:relative;padding:0 0 22px 22px">
    <span style="position:absolute;left:-7px;top:6px;width:12px;height:12px;border-radius:50%;background:var(--accent)"></span>
    <div class="muted" style="font-size:12px">⟦時刻・週⟧</div><h3>⟦出来事・マイルストーン⟧</h3><p class="muted" style="margin:0">⟦一言⟧</p>
  </li>
</ol>
<table class="table"><thead><tr><th>リスク</th><th>重大度</th><th>緩和策</th></tr></thead>
  <tbody><tr><td>⟦…⟧</td><td><span class="tag tag--high">HIGH</span></td><td>⟦…⟧</td></tr></tbody></table>
<div class="code" id="f1">
  <div class="code__name">⟦path/to/file.ts⟧ <span class="tag tag--med">要確認</span></div>
  <pre><span class="del">-  ⟦削除行⟧</span><span class="add">+  ⟦追加行⟧</span>   ⟦文脈行⟧</pre>
  <p style="padding:0 14px 12px;margin:0;font-size:14px"><span class="tag tag--high">HIGH</span> ⟦なぜ気になるか／壊れたらどうなるか⟧</p>
</div>
```

**deck の差し替え**（`<body>` の中身を丸ごとこれにし、土台の `<style>` と `hv.copyText` だけ残す）

```html
<style>
  .deck{position:fixed;inset:0;background:var(--bg)}
  .slide{position:absolute;inset:0;display:none;flex-direction:column;justify-content:center;max-width:900px;margin:0 auto;padding:6vw}
  .slide.is-on{display:flex}
  .slide h2{font-family:var(--serif);font-size:clamp(28px,5vw,52px);margin:0 0 18px}
  .slide li{font-size:clamp(17px,2.4vw,24px);margin:8px 0}
  .deck__nav{position:fixed;bottom:var(--sg-safe-bottom);left:50%;translate:-50% 0;display:flex;gap:14px;align-items:center;height:44px;padding:0 18px;font:13px var(--mono)}
  .deck__nav .hint{font-family:var(--sans);font-size:12px;color:var(--sg-ink-2)}
</style>
<div class="deck" id="deck">
  <section class="slide is-on"><p class="eyebrow">⟦提案 · 日付⟧</p><h2>⟦題名⟧</h2></section>
  <section class="slide"><h2>⟦1 枚 1 メッセージ⟧</h2><ul><li>⟦…⟧</li></ul></section>
  <section class="slide"><h2>次のアクション</h2><ul><li>⟦…⟧</li></ul></section>
  <div class="deck__nav sg sg--capsule"><span id="cur">1</span> / <span id="tot">3</span><span class="hint">← → / Space / クリック</span></div>
</div>
<script>
  var slides=[].slice.call(document.querySelectorAll('.slide')), i=0; document.getElementById('tot').textContent=slides.length;
  function go(n){ i=Math.max(0,Math.min(slides.length-1,n)); slides.forEach(function(s,k){s.classList.toggle('is-on',k===i);}); document.getElementById('cur').textContent=i+1; location.hash=i+1; }
  addEventListener('keydown',function(e){ if(['ArrowRight',' ','PageDown'].indexOf(e.key)>=0){e.preventDefault();go(i+1);} if(['ArrowLeft','PageUp'].indexOf(e.key)>=0){e.preventDefault();go(i-1);} });
  document.getElementById('deck').addEventListener('click',function(e){ if(!e.target.closest('a,button')) go(i+1); });
  go(parseInt((location.hash||'#1').slice(1),10)-1||0);
</script>
```

## 8. 土台 HTML（毎回これを丸ごとコピーして始める）

- 変えてよい場所: `<title>`、`hv:` メタ、`--accent`、`data-depth`、`<main>` の中身、`hv.QUIZ` の中身。
- 変えない場所: `.sg` 以下の CSS（墨硝子ライト）、上の帯・節ナビ・節メニュー・吹き出しの HTML、共通スクリプトの仕組み。

```html
<!doctype html>
<html lang="ja" data-depth="2">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>⟦ページの題名⟧</title>
<meta name="hv:design" content="sumi-glass-lite">
<meta name="hv:type" content="⟦explainer | code-reading | compare | plan-report | code-review | diagram | deck | design-system | prototype | editor⟧">
<meta name="hv:id" content="⟦NNN⟧">
<meta name="hv:created" content="⟦YYYY-MM-DD⟧">
<meta name="hv:goal" content="⟦到達目標を 1 文⟧">
<meta name="hv:takeaway" content="⟦核心モデルを 1 文⟧">
<meta name="hv:terms" content="⟦用語をカンマ区切り⟧">
<meta name="hv:sources" content="⟦対象ファイルのパスをカンマ区切り⟧">
<meta name="hv:parent" content="">
<style>
/* ── 紙（題材に合わせて動かしてよいのは --accent だけ）── */
:root{
  color-scheme: light dark;
  --accent:#2f6feb;                                  /* ⟦題材の一色⟧ */
  --accent-bg:color-mix(in oklab,var(--accent) 10%,var(--bg));
  --here:#d9822b;                                    /* いまここ・❓（暖色のまま）*/
  --bg:#f6f5f1; --panel:#fff; --ink:#191917; --muted:#5f5e58; --line:#e2e0d8;
  --code-bg:#14171f; --code-ink:#e6e8ee;
  --high:#c8372d; --med:#c27a12; --low:#2f8a4c; --info:#3a6fb0;
  --add:color-mix(in oklab,#2f8a4c 22%,var(--code-bg)); --del:color-mix(in oklab,#c8372d 24%,var(--code-bg));
  --sans:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP","Yu Gothic UI",sans-serif;
  --serif:"Hiragino Mincho ProN","Noto Serif JP","Yu Mincho",serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --r:14px; --r-sm:8px;
  /* ── 墨硝子（触らない）── */
  --sg-ink:#f6f5f0; --sg-ink-2:rgba(246,245,240,.66);
  --sg-a:.86; --sg-blur:10px;
  --sg-safe-top:max(12px,env(safe-area-inset-top)); --sg-safe-bottom:max(14px,env(safe-area-inset-bottom));
}
@media (prefers-color-scheme:dark){:root{
  --bg:#101318; --panel:#171b22; --ink:#ecebe6; --muted:#a3a29b; --line:#2a2f38; --code-bg:#0b0d12;
}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:84px}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.8 var(--sans);-webkit-text-size-adjust:100%}
.wrap{max-width:820px;margin:0 auto;padding:88px 16px 120px}
h1{font-family:var(--serif);font-size:clamp(26px,5vw,38px);line-height:1.3;margin:6px 0 10px;letter-spacing:-.01em}
h2{font-size:21px;line-height:1.4;margin:0} h3{font-size:16px;margin:0 0 6px}
a{color:var(--accent)} code{font-family:var(--mono);font-size:.9em}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.eyebrow{font-size:12px;letter-spacing:.08em;color:var(--muted);margin:0}
.lede{color:var(--muted);margin:0 0 18px}
.muted{color:var(--muted)}
.goal{border:1.5px solid var(--accent);border-radius:var(--r);padding:12px 16px;background:var(--accent-bg);margin:18px 0}
.goal b{display:block;font-size:12px;color:var(--accent);letter-spacing:.06em}
.section{margin:44px 0}
.section__head{display:flex;align-items:baseline;gap:10px;margin-bottom:12px;border-bottom:1px solid var(--line);padding-bottom:8px}
.section__no{font-family:var(--mono);font-size:13px;color:var(--accent)}
.flag{margin-left:auto;font:inherit;font-size:13px;border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:999px;padding:2px 10px;cursor:pointer}
.flag[aria-pressed="true"]{background:var(--here);border-color:var(--here);color:#fff}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:14px 0}
.core{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:var(--r);padding:16px 18px}
.core__model{font-family:var(--serif);font-size:19px;line-height:1.6;margin:0 0 8px}
.core__break{margin-top:12px;padding-top:10px;border-top:1px dashed var(--line);font-size:14px}
.core__break b,.concrete>b,.why>b,.mis>b,.provenance>b{display:block;font-size:12px;letter-spacing:.06em}
.concrete{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;margin:14px 0}
.concrete>b{color:var(--low)}
.why{border-left:3px solid var(--info);padding:4px 14px;margin:14px 0}.why>b{color:var(--info)}
.mis{border-left:3px solid var(--high);padding:4px 14px;margin:14px 0}.mis>b{color:var(--high)}
.provenance{font-size:13px;color:var(--muted);border:1px dashed var(--line);border-radius:var(--r-sm);padding:6px 10px;margin:10px 0}
.callout{border-radius:var(--r);padding:12px 16px;background:var(--accent-bg);margin:14px 0}
.callout--tldr h3{color:var(--accent)}
.stub{display:none;align-items:center;gap:10px;font-size:13px;color:var(--muted);border:1px dashed var(--line);border-radius:var(--r-sm);padding:6px 10px;margin:10px 0}
.stub button{font:inherit;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:2px 10px;cursor:pointer}
html[data-depth="1"] .d2,html[data-depth="1"] .d3,html[data-depth="2"] .d3{display:none}
html[data-depth="1"] .stub[data-need="2"],html[data-depth="1"] .stub[data-need="3"],html[data-depth="2"] .stub[data-need="3"]{display:flex}
.table{width:100%;border-collapse:collapse;font-size:14px;margin:14px 0;display:block;overflow-x:auto}
.table th,.table td{border-bottom:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
.table th{font-size:12px;color:var(--muted);letter-spacing:.04em}
.tag{display:inline-block;font-size:11px;font-weight:600;border-radius:999px;padding:1px 8px;color:#fff;vertical-align:middle}
.tag--high{background:var(--high)}.tag--med{background:var(--med)}.tag--low{background:var(--low)}.tag--info{background:var(--info)}
.code{background:var(--code-bg);color:var(--code-ink);border-radius:var(--r);margin:14px 0;overflow:hidden}
.code__name{font-family:var(--mono);font-size:12px;color:#9aa3b5;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
.code pre{margin:0;padding:12px 14px;overflow-x:auto;font:13px/1.65 var(--mono)}
.code .add,.code .del,.code .hl{display:block}.code .add{background:var(--add)}.code .del{background:var(--del)}
.code .hl{background:color-mix(in oklab,var(--here) 30%,var(--code-bg))}
.term{color:inherit;text-decoration:underline dotted var(--accent);text-underline-offset:3px;cursor:help}
.glossary dt{font-weight:700;margin-top:10px}.glossary dd{margin:0 0 0 1em;color:var(--muted)}
.quiz__q{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;margin:12px 0}
.quiz__opts{display:grid;gap:6px;margin:8px 0}
.quiz__opts button{font:inherit;text-align:left;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:var(--r-sm);padding:7px 12px;cursor:pointer}
.quiz__opts button.is-ok{border-color:var(--low);background:color-mix(in oklab,var(--low) 14%,var(--bg))}
.quiz__opts button.is-ng{border-color:var(--high);background:color-mix(in oklab,var(--high) 12%,var(--bg))}
.quiz__why{font-size:14px;border-left:3px solid var(--accent);padding:2px 12px}
.btn{font:inherit;border:0;background:var(--accent);color:#fff;border-radius:999px;padding:8px 18px;cursor:pointer}
textarea{width:100%;min-height:90px;font:inherit;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--panel);color:var(--ink);padding:8px 10px}
#askOut{white-space:pre-wrap}

/* ── 墨硝子ライト：内容の上に浮く chrome だけに使う（触らない）── */
.sg{color:var(--sg-ink);background:rgba(28,30,36,var(--sg-a));
  -webkit-backdrop-filter:blur(var(--sg-blur)) saturate(140%);backdrop-filter:blur(var(--sg-blur)) saturate(140%);
  border:.5px solid rgba(255,255,255,.11);border-radius:22px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),inset 0 -1px 0 rgba(255,255,255,.05),0 8px 22px rgba(0,0,0,.24),0 1px 2px rgba(0,0,0,.10);
  transition:background-color .45s cubic-bezier(.2,.8,.2,1)}
.sg.is-dim{--sg-a:.52}                                /* 暗い内容の上では透ける */
.sg--capsule{border-radius:999px}
.sg--thin{--sg-blur:5px;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 2px 6px rgba(0,0,0,.2)}
.sg button,.sg a{color:var(--sg-ink);font:inherit}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.sg{--sg-a:.95}.sg.is-dim{--sg-a:.9}}
@media (prefers-reduced-transparency:reduce){.sg,.sg.is-dim{--sg-a:.97;backdrop-filter:none;-webkit-backdrop-filter:none}}
@media (prefers-contrast:more){.sg,.sg.is-dim{--sg-a:1;border-color:#fff}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}

.hv-bar{position:fixed;z-index:20;top:var(--sg-safe-top);left:50%;translate:-50% 0;width:min(780px,calc(100% - 24px));
  display:flex;align-items:center;gap:10px;height:46px;padding:0 8px 0 18px;font-size:13px}
.hv-bar__title{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
.hv-bar__meta{color:var(--sg-ink-2);white-space:nowrap}
.hv-depth{display:flex;background:rgba(255,255,255,.08);border-radius:999px;padding:2px}
.hv-depth button{border:0;background:none;border-radius:999px;padding:3px 10px;cursor:pointer;font-size:12px;color:var(--sg-ink-2)}
.hv-depth button[aria-pressed="true"]{background:var(--sg-ink);color:#16181d}
.hv-ask{border:0;background:none;cursor:pointer;padding:4px 8px;white-space:nowrap}
.hv-dock{position:fixed;z-index:20;bottom:var(--sg-safe-bottom);left:50%;translate:-50% 0;
  display:flex;align-items:center;gap:4px;height:46px;padding:0 6px;max-width:calc(100% - 24px)}
.hv-dock button{border:0;background:none;cursor:pointer;padding:6px 12px;border-radius:999px}
.hv-dock__cur{max-width:52vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px}
.hv-menu{margin:auto auto calc(var(--sg-safe-bottom) + 56px);width:min(420px,calc(100% - 24px));max-height:60vh;overflow:auto;padding:8px;inset:auto 0 0 0}
.hv-menu a{display:block;text-decoration:none;padding:8px 12px;border-radius:12px;font-size:14px}
.hv-menu a:hover,.hv-menu a.is-here{background:rgba(255,255,255,.1)}
.hv-menu::backdrop{background:transparent}
.hv-tip{position:fixed;z-index:30;max-width:min(320px,calc(100% - 24px));padding:10px 14px;font-size:14px;line-height:1.6;border-radius:16px}
.fig{margin:16px 0}.fig__body{position:relative}.fig__body svg{display:block;width:100%;height:auto}
.fig__chip{position:absolute;padding:3px 10px;font-size:12px;white-space:nowrap;--sg-a:.78}
.fig__chip.is-here{background:color-mix(in oklab,var(--here) 70%,rgb(28,30,36))}
.fig__cap{font-size:13px;color:var(--muted);margin-top:6px}
@media (max-width:560px){.hv-bar__meta{display:none}.hv-bar{padding-left:14px}}
@media print{.sg,.hv-bar,.hv-dock,.hv-menu,.hv-tip,.flag,.stub{display:none!important}
  html[data-depth] .d2,html[data-depth] .d3{display:revert!important}
  .wrap{padding:0}.code{background:#fff;color:#111;border:1px solid #ccc}.fig__chip{display:none}}
</style>
</head>
<body>
<!-- ① 上の帯（墨硝子）-->
<header class="hv-bar sg sg--capsule" data-sg>
  <span class="hv-bar__title" id="barTitle"></span>
  <span class="hv-bar__meta" id="readTime"></span>
  <div class="hv-depth" role="group" aria-label="深さ">
    <button data-d="1" aria-pressed="false">ざっくり</button><button data-d="2" aria-pressed="false">しっかり</button><button data-d="3" aria-pressed="false">コードまで</button>
  </div>
  <button class="hv-ask" id="askJump" title="疑問の書き出しへ">❓ <span id="flagN">0</span></button>
</header>

<main class="wrap">
  <p class="eyebrow">⟦種別 · 対象 · YYYY-MM-DD⟧</p>
  <h1>⟦ページの題名⟧</h1>
  <p class="lede">⟦1〜2 文の導入⟧</p>
  <div class="goal"><b>読み終えたらできること</b>⟦到達目標を 1 文⟧</div>
  <div class="callout callout--tldr"><h3>要点</h3><p>⟦3 文で全体像⟧</p></div>

  <section class="section" id="s1" data-title="核心モデル">
    <div class="section__head"><span class="section__no">§1</span><h2>核心モデル</h2></div>
    <div class="core">
      <p class="core__model">⟦これ一つ掴めば残りが導ける比喩か構造⟧</p>
      <p>⟦比喩と実物の対応を 2〜3 行⟧</p>
      <div class="core__break d2"><b>この比喩が崩れる所</b><ul><li>⟦崩れる所 1⟧</li><li>⟦崩れる所 2⟧</li></ul></div>
    </div>
  </section>

  <section class="section" id="s2" data-title="⟦節の名前⟧">
    <div class="section__head"><span class="section__no">§2</span><h2>⟦節の名前⟧</h2></div>
    <p>⟦抽象の説明。専門語は <a class="term" href="#g-example" title="⟦一言の言い換え⟧">⟦用語⟧</a> のように印を付ける⟧</p>
    <div class="concrete"><b>具体例</b>⟦本物の値・本物の行で 1 例⟧</div>
    <div class="stub" data-need="2">ここに「なぜこの形か」があります <button data-d="2">しっかりで開く</button></div>
    <div class="why d2"><b>なぜこの形か</b>⟦理由・引き換えに失うもの・選ばれなかった案⟧</div>
    <div class="mis"><b>よくある誤解</b>⟦誤解とその訂正⟧</div>
  </section>

  <section class="section" id="quiz" data-title="理解チェック">
    <div class="section__head"><span class="section__no">✓</span><h2>理解チェック（先に予想してから開く）</h2></div>
    <div id="quizHost"></div>
  </section>

  <section class="section" id="glossary" data-title="ことば辞典">
    <div class="section__head"><span class="section__no">辞</span><h2>ことば辞典</h2></div>
    <dl class="glossary">
      <dt id="g-example">⟦用語⟧</dt><dd>⟦言い換え⟧</dd>
    </dl>
  </section>

  <section class="section" id="ask" data-title="疑問の書き出し">
    <div class="section__head"><span class="section__no">？</span><h2>疑問を書き出して、Copilot Chat に戻す</h2></div>
    <p class="muted">わからなかった節は見出しの ❓ を押して印を付けてください。理解チェックの結果と一緒に、Copilot Chat に貼る依頼文になります。</p>
    <textarea id="askFree" placeholder="自由に質問を書く（任意）"></textarea>
    <p><button class="btn" id="askCopy">依頼文を作ってコピー</button></p>
    <div class="code" id="askOutBox" hidden><pre id="askOut"></pre></div>
  </section>
</main>

<!-- ② 下の節ナビ（墨硝子）と節メニュー（top layer）-->
<nav class="hv-dock sg sg--capsule" data-sg aria-label="節の移動">
  <button id="prevSec" aria-label="前の節">‹</button>
  <button class="hv-dock__cur" id="curSec" popovertarget="secMenu" aria-label="節の一覧"></button>
  <button id="nextSec" aria-label="次の節">›</button>
</nav>
<div class="hv-menu sg" id="secMenu" popover></div>
<div class="hv-tip sg" id="tip" role="tooltip" hidden></div>

<script>
(function(){
  var hv = window.hv = {};
  var $ = function(s,r){return (r||document).querySelector(s)}, $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  hv.DEPTH_LABEL = {1:'ざっくり',2:'しっかり',3:'コードまで'};

  /* ── 理解チェック：ここだけ書き換える ── */
  hv.QUIZ = [
    { q:'⟦X を変えたら／消したら／失敗したら?⟧', opts:['⟦誤答（誤解に対応）⟧','⟦正解⟧','⟦誤答⟧'], ans:1, why:'⟦根拠の節を指す（§2 の具体例 など）⟧' }
  ];

  /* 深さ */
  hv.depth = function(){ return parseInt(document.documentElement.dataset.depth,10)||2; };
  hv.setDepth = function(n){ document.documentElement.dataset.depth = String(n);
    $$('.hv-depth button').forEach(function(b){ b.setAttribute('aria-pressed', String(+b.dataset.d===n)); }); if (hv.dim) hv.dim(); };
  $$('[data-d]').forEach(function(b){ b.addEventListener('click',function(){ hv.setDepth(+b.dataset.d); }); });
  hv.setDepth(hv.depth());

  /* 題名・読了目安 */
  $('#barTitle').textContent = document.title;
  var chars = ($('main').innerText||'').replace(/\s/g,'').length;
  $('#readTime').textContent = '約 ' + Math.max(1, Math.round(chars/500)) + ' 分';

  /* 節：❓ の印・節ナビ・メニュー */
  var secs = $$('main .section[id]');
  secs.forEach(function(s){
    if (s.id==='ask'||s.id==='glossary') return;
    var b = document.createElement('button'); b.className='flag'; b.type='button';
    b.textContent='❓ わからない'; b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(){ b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed')!=='true')); $('#flagN').textContent = hv.flagged().length; });
    $('.section__head',s).appendChild(b);
  });
  hv.flagged = function(){ return secs.filter(function(s){ var f=$('.flag',s); return f && f.getAttribute('aria-pressed')==='true'; }); };
  var name = function(s){ return s.dataset.title || ($('h2',s)||{}).textContent || s.id; };
  $('#secMenu').innerHTML = secs.map(function(s,i){ return '<a href="#'+s.id+'" data-i="'+i+'">'+name(s)+'</a>'; }).join('');
  $$('#secMenu a').forEach(function(a){ a.addEventListener('click',function(){ try{$('#secMenu').hidePopover();}catch(e){} }); });
  var cur = 0;
  function here(){ var y = 100; cur = 0;
    secs.forEach(function(s,i){ if (s.offsetParent && s.getBoundingClientRect().top <= y) cur = i; });
    $('#curSec').textContent = (cur+1)+' / '+secs.length+'　'+name(secs[cur]);
    $$('#secMenu a').forEach(function(a){ a.classList.toggle('is-here', +a.dataset.i===cur); }); }
  function go(i){ var s = secs[Math.max(0,Math.min(secs.length-1,i))]; s.scrollIntoView({behavior:'smooth'}); }
  $('#prevSec').addEventListener('click',function(){ go(cur-1); });
  $('#nextSec').addEventListener('click',function(){ go(cur+1); });
  $('#askJump').addEventListener('click',function(){ $('#ask').scrollIntoView({behavior:'smooth'}); });

  /* 調光：帯の真下が暗い内容（.code / [data-dark]）なら透かす */
  hv.dim = function(){
    $$('[data-sg]').forEach(function(el){
      var r = el.getBoundingClientRect(), vis = el.style.visibility;
      el.style.visibility='hidden';
      var under = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      el.style.visibility = vis;
      el.classList.toggle('is-dim', !!(under && under.closest && under.closest('.code,[data-dark]')));
    });
  };
  var tick = false;
  addEventListener('scroll',function(){ if(!tick){ tick=true; requestAnimationFrame(function(){ tick=false; here(); hv.dim(); }); } },{passive:true});
  addEventListener('resize',function(){ here(); hv.dim(); });

  /* 用語の吹き出し（墨硝子）*/
  var tip = $('#tip');
  document.addEventListener('click',function(e){
    var t = e.target.closest && e.target.closest('.term');
    if (!t){ tip.hidden = true; return; }
    e.preventDefault();
    tip.textContent = t.getAttribute('title') || t.textContent; tip.hidden = false;
    var r = t.getBoundingClientRect(), w = tip.offsetWidth;
    tip.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.left)) + 'px';
    tip.style.top = (r.bottom + 8 + tip.offsetHeight > innerHeight ? r.top - tip.offsetHeight - 8 : r.bottom + 8) + 'px';
  });
  addEventListener('keydown',function(e){ if(e.key==='Escape') tip.hidden = true; });

  /* 理解チェック：選ぶまで答えは見えない */
  hv.QRES = hv.QUIZ.map(function(){ return null; });
  $('#quizHost').innerHTML = hv.QUIZ.map(function(x,i){
    return '<div class="quiz__q"><b>Q'+(i+1)+'.</b> '+x.q+'<div class="quiz__opts">'+
      x.opts.concat(['わからない']).map(function(o,k){ return '<button type="button" data-q="'+i+'" data-k="'+k+'">'+o+'</button>'; }).join('')+
      '</div><div class="quiz__why" hidden></div></div>'; }).join('');
  $$('#quizHost button').forEach(function(b){ b.addEventListener('click',function(){
    var i=+b.dataset.q, k=+b.dataset.k, x=hv.QUIZ[i], box=b.closest('.quiz__q'), idk = k===x.opts.length;
    hv.QRES[i] = {picked:k, ok:k===x.ans, idk:idk};
    $$('button',box).forEach(function(o){ o.classList.remove('is-ok','is-ng'); });
    $$('button',box)[x.ans].classList.add('is-ok'); if(!idk && k!==x.ans) b.classList.add('is-ng');
    var w=$('.quiz__why',box); w.hidden=false; w.textContent=(idk?'答え: ':(k===x.ans?'正解。':'惜しい。'))+(idk?x.opts[x.ans]+'。':'')+x.why;
  }); });

  /* 疑問の書き出し */
  hv.copyText = function(text, btn, done){
    var ok = function(){ if(btn){ var o=btn.textContent; btn.textContent=done||'コピーしました'; setTimeout(function(){btn.textContent=o;},1600);} };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
    function fallback(){ var t=document.createElement('textarea'); t.value=text; document.body.appendChild(t); t.select(); try{document.execCommand('copy');ok();}catch(e){} t.remove(); }
  };
  hv.buildAsk = function(){
    var L=[], meta=function(n){ var m=$('meta[name="hv:'+n+'"]'); return m?m.content:''; };
    L.push('# 「'+document.title+'」への疑問');
    L.push('（記録 '+meta('id')+' ／ 読んだ深さ: '+hv.DEPTH_LABEL[hv.depth()]+'）');
    L.push('','## わからなかった箇所');
    var f=hv.flagged(); if(!f.length) L.push('- （印なし）');
    f.forEach(function(s){ L.push('- '+($('.section__no',s)||{}).textContent+' '+name(s)); });
    if (hv.QUIZ.length){ L.push('','## 理解チェックの結果');
      hv.QUIZ.forEach(function(x,i){ var r=hv.QRES[i];
        L.push('- Q'+(i+1)+': '+(!r?'未回答':r.idk?'わからなかった':r.ok?'正解':'不正解（選んだ: '+x.opts[r.picked]+'）')+' — '+x.q); }); }
    L.push('','## 質問（自由記述）', ($('#askFree').value||'').trim()||'（なし）');
    L.push('','## 依頼','sumi-visualizer の手順で、上の印の付いた節と外した問いだけを対象に、一段深い続きページ（記録 '+meta('id')+'b、深さ「コードまで」）を作ってください。元ページ全体は作り直さないでください。');
    return L.join('\n');
  };
  $('#askCopy').addEventListener('click',function(){ var md=hv.buildAsk(); $('#askOut').textContent=md; $('#askOutBox').hidden=false; hv.copyText(md,this,'コピーしました。Copilot Chat に貼ってください'); });

  here(); hv.dim();
})();
</script>
</body>
</html>
```
