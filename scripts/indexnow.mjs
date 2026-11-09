// Tells IndexNow (Bing, Yandex, Seznam, Naver; Bing's index also feeds
// ChatGPT search and Copilot) which URLs exist, straight from the live
// sitemap. Run after a production deploy:
//   node scripts/indexnow.mjs            submit every sitemap URL
//   node scripts/indexnow.mjs --dry-run  print what would be sent
// The key is public by design: IndexNow verifies ownership by fetching
// https://operator.codes/<key>.txt and checking it matches.

const HOST = "operator.codes";
const KEY = "058180b9ecf9b12f564bb7b030ce6b06";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const dryRun = process.argv.includes("--dry-run");

const res = await fetch(SITEMAP);
if (!res.ok) throw new Error(`sitemap ${res.status}`);
const xml = await res.text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (urlList.length === 0) throw new Error("sitemap has no URLs");

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

const post = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
// 200 and 202 both mean accepted; 202 means the key check is pending.
console.log(`IndexNow: ${post.status} for ${urlList.length} URLs`);
if (post.status >= 400) process.exit(1);
