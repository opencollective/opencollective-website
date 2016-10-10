/**
 * This breaks down a markdown text into multiple pages
 * @PRE:
 *   param1: value1
 *   param2: value2
 * 
 *   intro text
 * 
 *   # title1
 *   Hello
 *   # title2
 *   World
 * @POST: {
 *  sections: {
 *    intro: "intro text",
 *    title1: "Hello",
 *    title2: "World"
 *  },
 *  params: {
 *    "param1": "value1",
 *    "param2": "value2"
 *  }
 * }
 */
export default function processMarkdown(text) {

  const body = { sections: {}, params: {} };
  if (!text) {
    body.sections = { intro: '' };
    return body;
  }

  const lines = text.trim().split('\n');

  let currentTitle = 'intro';
  let isHeader = true;
  let paragraph = [];
  lines.forEach((line) => {
    if (isHeader && line.match(/^[a-z]+:.+/i)) {
      const tokens = line.match(/([^:]+):(.+)/);
      body.params[tokens[1]] = tokens[2].trim();
      return;
    } else {
      isHeader = false;
    }
    if (line.length <= 30) {
      const match = line.match(/^# *([^#]{2,30})/i);
      if (match) {
        body.sections[currentTitle] = paragraph.join('\n').trim();
        currentTitle = match[1];
        paragraph = [];
        return;
      }
    }
    paragraph.push(line);
  });
  body.sections[currentTitle] = paragraph.join('\n').trim();

  return body;
}