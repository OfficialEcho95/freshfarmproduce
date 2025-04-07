/* eslint-disable linebreak-style */
/* eslint-disable indent */
// eslint-disable-next-line linebreak-style
/* eslint-disable jest/require-hook */
/* eslint-disable linebreak-style */
const app = require('./server');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('Server listening on port:', PORT);
});
