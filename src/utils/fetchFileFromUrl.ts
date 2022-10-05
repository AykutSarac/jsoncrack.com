export default async function fetchFileFromUrl(url: string) {
  return await fetch(url).then(r => r.text());
}
