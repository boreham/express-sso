import express from 'express';
import path from 'path';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import routes from './routes';

const app = express();
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, './keycloak.json');

// ВАЖНО! Отключает работу через сертификат электронной подписи
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(session({
     secret: 'your-secret',
     resave: false,
     saveUninitialized: true,
     // store: memoryStore,
     cookie: { secure: false } // Убедитесь, что secure: true только в производственной среде с HTTPS
}));

app.use(keycloak.middleware());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes(keycloak));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
});