const app = require('./app');

/// start node js server 
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})