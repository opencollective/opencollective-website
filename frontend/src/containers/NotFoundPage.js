import { Link } from 'react-router'

export default () => {
  <div id="content-404">
    <a href='https://opencollective.com/'>
      <img src={require('../assets/images/LogoLargeTransparent.png')} />
    </a>
    <p><b>Not Found!</b></p>
    <p>Try our <Link to='/'>homepage</Link>, <Link to='/faq'>FAQ</Link> or <a href='https://medium.com/open-collective'>blog</a>. </p>
    <p>Or chat with us on our <a href='https://slack.opencollective.com/'>Slack channel</a>.</p>
    <img src='/static/images/404.gif' />
  </div>
}
