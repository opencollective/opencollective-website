import Widget from '../components/Widget'
import i18n from '../lib/i18n'

/**
 * Note: The Widget renderer is used by the server side renderer
 *
 * This wrapper allows that component to use the i18n system in our project
 * without having to depend on it directly
 */
export default (props = {}) =>
  <Widget { ...props } i18n={i18n(props.lang)} />
