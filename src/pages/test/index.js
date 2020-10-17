import { Helmet } from 'react-helmet-async'
import { Link } from "react-router-dom"

export default ({ state, actions }) =>
  <article>
    <Helmet>
      <title>Test</title>
    </Helmet>

    <h1>Test</h1>

    <h4>State</h4>
    <p>
      <button onClick={() => actions.test()}>
        { state.test }
      </button>
    </p>

    <hr/>

    <h4>API</h4>
    <p>
      <button onClick={() => actions.testApi()}>
        Request
      </button>
    </p>

    <h4>Response</h4>
    <pre><code>{
      state.testApiResponse
    }</code></pre>

    <hr/>
    <Link to='/'>Back to home</Link>
  </article>
