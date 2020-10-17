
export function test() {
  this.setState({
    test: this.state.test + 1
  })
}

export async function testApi() {

  const request = {}

  try {

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    const data = await response.json()

    this.setState({
      testApiResponse: JSON.stringify(data, null, 2)
    })

  } catch(error) {

    this.setState({
      testApiResponse: `Error: ${error.message}`
    })
  }
}
