/**
 * Gives us info about project components
 */

export const describe = (component, project) => {
  switch (component.type) {
    case 'script/help':
      showScriptHelp(component, project)
      break;
  }
}

const showScriptHelp = ({component}, project) => {
  const cli = project.cli

  cli.print('DESCRIB')
}
