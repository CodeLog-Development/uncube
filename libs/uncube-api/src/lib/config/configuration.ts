import { defineSecret } from 'firebase-functions/params';

export const serviceAccount = defineSecret('FIREBASE_SERVICE_ACCOUNT');
export const mailHost = defineSecret('MAIL_HOST');
export const mailUser = defineSecret('MAIL_USER');
export const mailPassword = defineSecret('MAIL_PASSWORD');
export const mailFrom = defineSecret('MAIL_FROM');

export default () => ({
  serviceAccount: JSON.parse(serviceAccount.value()),
  mailConfig: {
    host: mailHost.value(),
    user: mailUser.value(),
    password: mailPassword.value(),
    from: mailFrom.value(),
  },
});
