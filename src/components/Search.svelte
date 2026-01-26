<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let keywordDesktop = "";
let keywordMobile = "";
const cx = "a26c961079daa4ede"; // Google CSE ID

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = (keyword: string, isDesktop: boolean): void => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		return;
	}
	setPanelVisibility(true, isDesktop);

	// Google CSEの結果を実行
	const gcs = (window as any).google?.search?.cse?.element;
	if (gcs) {
		const element = gcs.getElement("results-element-works");
		if (element) {
			element.execute(keyword);
		}
	}
};

onMount(() => {
	// Google CSEスクリプトの読み込み
	const script = document.createElement("script");
	script.src = `https://cse.google.com/cse.js?cx=${cx}`;
	script.async = true;
	document.head.appendChild(script);
});

let searchTimer: any;
const debouncedSearch = (keyword: string, isDesktop: boolean) => {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		search(keyword, isDesktop);
	}, 300);
};

// 入力値が変わるたびにデバウンス検索を実行
$: if (keywordDesktop !== undefined) debouncedSearch(keywordDesktop, true);
$: if (keywordMobile !== undefined) debouncedSearch(keywordMobile, false);
</script>

<!-- 検索バー（デスクトップ） -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop} on:focus={() => search(keywordDesktop, true)}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
</div>

<!-- 検索パネルトグルボタン（モバイル） -->
<button on:click={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- 検索結果パネル -->
<!-- PC版では検索バーの直下に配置。!overflow-visible で結果の表示を保証 -->
<div id="search-panel" class="float-panel float-panel-closed absolute 
      w-[calc(100vw-2rem)] md:w-[60rem]
      top-[10.5rem] md:top-[4.25rem] left-4 md:left-[50%] md:-translate-x-[50%] right-4
      transition-all duration-300 z-[9999] !bg-transparent !shadow-none !border-none !overflow-visible">

    <!-- モバイル用検索バー (維持) -->
    <div id="search-bar-inside" class="flex lg:hidden relative transition-all items-center h-12 rounded-xl
      bg-[var(--card-bg)] shadow-lg mb-4
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.5rem] pointer-events-none ml-4 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="Search" bind:value={keywordMobile}
               class="pl-12 absolute inset-0 text-base bg-transparent outline-0
               focus:w-full text-black/50 dark:text-white/50"
        >
    </div>

    <!-- Google CSE 結果表示エリア -->
    <div class="gcse-searchresults-only" data-gname="results-element-works" data-linkTarget="_self"></div>
</div>

<style>
  input:focus {
    outline: 0;
  }
  
  /* Google CSE 本体コンテナのテーマ適用 (二重枠の解消) */
  :global(.gsc-control-cse) {
    --text-color: #374151; /* gray-700 */
    background-color: var(--card-bg) !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
    border-radius: 1rem !important;
    padding: 1.25rem !important;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3) !important;
    width: 100% !important;
    font-family: inherit !important;
    max-height: 80vh;
    overflow-y: auto !important;
    display: block !important;
    margin: 0 !important;
  }
  :global(.dark .gsc-control-cse) {
    --text-color: #f3f4f6; /* gray-100 */
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
  }

  /* Table Reset: グローバルのTableスタイルからの干渉を防ぐ */
  :global(.gsc-control-cse table), 
  :global(.gsc-control-cse tbody), 
  :global(.gsc-control-cse tr) {
    display: table !important;
    width: 100% !important;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
  :global(.gsc-control-cse td) {
    display: table-cell !important;
    vertical-align: top !important;
    padding: 0 !important;
    background: transparent !important;
  }

  /* 不要なGoogleデフォルト要素の非表示 */
  :global(.gsc-search-box, .gsc-adBlock, .gsc-modal-background-image, .gsc-results-close-btn) {
    display: none !important;
  }

  /* 検索結果（タイトル）のデザイン */
  :global(.gs-title, .gs-title *, .gs-title b, .gs-title a, .gs-title a:visited) {
    color: var(--primary) !important;
    text-decoration: none !important;
    font-size: 1.1rem !important;
    font-weight: bold !important;
    background: transparent !important;
  }
  
  /* スニペット（説明文）のデザイン */
  :global(.gs-snippet, .gs-snippet *) {
    color: var(--text-color) !important;
    opacity: 0.85;
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
  }
  
  /* ページネーションのデザイン */
  :global(.gsc-cursor-box) {
    margin-top: 1.5rem !important;
  }
  :global(.gsc-cursor-page) {
    color: var(--text-color) !important;
    background-color: rgba(0,0,0,0.05) !important;
    border-radius: 4px;
    padding: 6px 10px !important;
    margin-right: 6px !important;
    text-decoration: none !important;
    display: inline-block !important;
  }
  :global(.gsc-cursor-current-page) {
    background-color: var(--primary) !important;
    color: white !important;
  }
  :global(.dark .gsc-cursor-page) {
    background-color: rgba(255,255,255,0.1) !important;
  }

  /* 不要なURL表示を隠す */
  :global(.gsc-url-top, .gsc-url-bottom, .gs-visibleUrl) {
    display: none !important;
  }

  /* 個々の検索結果アイテムの区切り */
  :global(.gsc-result, .gsc-webResult) {
    background-color: transparent !important;
    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
    padding: 1rem 0 !important;
    margin: 0 !important;
  }
  :global(.dark .gsc-result, .dark .gsc-webResult) {
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
  }
  
  /* 検索結果の情報エリア（"約 X 件"） */
  :global(.gsc-result-info) {
    color: var(--text-color) !important;
    opacity: 0.6;
    margin-bottom: 0.75rem !important;
    font-size: 0.85rem !important;
  }
</style>
