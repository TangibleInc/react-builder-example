import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { Link } from "react-router-dom"

const Page = ({ staticContext }) => {

  if (staticContext) staticContext.status = 404

  return (
    <article>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <h1>Not found</h1>
      <Link to='/'>Back to home</Link>
    </article>
  )
}

export default withRouter(Page)