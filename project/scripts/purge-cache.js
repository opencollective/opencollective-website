const project = global.project
import request from 'request'

const config = require(project.paths.join('server/node_modules/config'))

const options = {
    method: 'DELETE',
    uri: "https://api.cloudflare.com/client/v4/zones/37b6a50c4c5be74e5a6ab8e34620bb1b/purge_cache",
    headers: {
      'X-Auth-Email': config.cloudflare.email,
      'X-Auth-Key': config.cloudflare.key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'purge_everything': true})
  }

  request(options, (err, res, body) => {
    if (err) {
      project.cli.print('FAILURE'.red)
      const response = JSON.parse(body);

      if (!response.success) {
        project.cli.print(response.errors[0].message, 6);
      }
    } else {
      project.cli.print('SUCCESS'.green)
    }
  });
