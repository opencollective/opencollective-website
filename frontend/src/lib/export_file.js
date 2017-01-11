export function exportFile(mimeType, filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType},${encodeURIComponent(text)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function exportMembers(authenticatedUser, collective) {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { authorization: `Bearer ${accessToken}`};

  return fetch(`/api/groups/${collective.slug}/users.csv`, { headers })
    .then(response => response.text())
    .then(csv => {
      const d = new Date;
      const mm = d.getMonth() + 1;
      const dd = d.getDate();
      const date =  [d.getFullYear(), (mm < 10) ? `0${mm}` : mm, (dd < 10) ? `0${dd}` : dd].join('');
      const filename = `${date}-${collective.slug}-members.csv`;
      exportFile('text/plain;charset=utf-8', filename, csv);
    });
}
