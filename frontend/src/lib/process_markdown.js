/**
 * This breaks down a markdown text into multiple pages
 * @PRE:
 *   intro text
 *   # title1
 *   Hello
 *   # title2
 *   World
 * @POST: {
 *  intro: "intro text",
 *  title1: "Hello",
 *  title2: "World"
 * }
 */
export default function processMarkdown(text) {

  if (!text) return { intro: '' };

  const lines = text.split('\n');

  const body = {};
  let currentTitle = 'intro';
  let paragraph = [];
  lines.forEach((line) => {
    if (line.length <= 20) {
      const match = line.match(/^# *([^#]{2,20})/i);
      if (match) {
        body[currentTitle] = paragraph.join('\n').trim();
        currentTitle = match[1];
        paragraph = [];
        return;
      }
    }
    paragraph.push(line);
  });
  body[currentTitle] = paragraph.join('\n').trim();

  return body;
}