import { Helmet } from 'react-helmet-async'
import { Link } from "react-router-dom"

export default () =>
  <article>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h1>Home</h1>
    <Link to="/test">Test</Link><br/>
    <Link to="/asdf">Non-existing route</Link>
  </article>
