export default (mimeType, filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType},${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}