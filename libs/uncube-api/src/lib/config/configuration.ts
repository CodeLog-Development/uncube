import * as fs from 'fs';

export default () => ({
  serviceAccount: JSON.parse(
    fs.readFileSync('firebase-service-account.json').toString()
  ),
});
