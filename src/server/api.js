export default function api(app) {

  app.post('/api', (req, res) => {
    res.send({
      message: new Date
    })
  })

}