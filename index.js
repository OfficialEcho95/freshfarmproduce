/* eslint-disable linebreak-style */
/* eslint-disable indent */
// eslint-disable-next-line linebreak-style
/* eslint-disable jest/require-hook */
/* eslint-disable linebreak-style */
const app = require('./server');

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
    console.log('Starting the server...');
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
} else {
    console.log('Running in test mode - server not started');
}
module.exports = app;
