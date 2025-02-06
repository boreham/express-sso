import { Router, Request, Response } from 'express';
import Keycloak from 'keycloak-connect';
import SessionData from '../types/express-session'

const createRoutes = (keycloak: Keycloak.Keycloak): Router => {
    const router = Router();

    // Главная страница
    router.get('/', (req: Request, res: Response) => {
        res.render('index', {
            title: 'Home',
            isAuthenticated: req.session.isAuthenticated || false // Передаем состояние авторизации
        });
    });

    router.get('/login', keycloak.protect(), (req: Request, res: Response) => {
        res.render('protected', {
            title: 'Protected Page',
            isAuthenticated: req.session.isAuthenticated || false
        });
    });

    router.post('/login', (req: Request, res: Response) => {
        // Здесь должна быть ваша логика аутентификации
        req.session.isAuthenticated = true; // Устанавливаем флаг авторизации
        res.redirect('/');
    });

    // Защищённая страница
    // router.get('/protected', keycloak.protect(), (req: Request, res: Response) => {
    //     res.render('index', { title: 'Protected Resource', isAuthenticated: req.session.isAuthenticated || false });
    // });

    router.get('/protected', keycloak.protect(), (req: Request, res: Response) => {
        // Передаем состояние авторизации в шаблон
        res.render('protected', {
            title: 'Protected Page',
            isAuthenticated: req.session.isAuthenticated || false
        });
    });

    // Маршрут для выхода
    router.get('/logout', (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).send('Could not log out.');
            }
            res.redirect('/'); // Перенаправляем на главную страницу после выхода
        });
    });

    return router;
};

export default createRoutes;