import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import logger from './config/logger';
import userRoutes from './routes/user.route'

const router = express();

/** Handle uncaught exceptions */
process.on('uncaughtException', (e) => {
	logger.error(e);
	process.exit(1);
});

/** Handle unhandled rejections */
process.on('unhandledRejection', (e) => {
	logger.error(e);
	process.exit(1);
});

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        logger.info('Mongo connected successfully.');
        StartServer();
    })
    .catch((error) => logger.error(error));

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        logger.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            logger.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    /** Routes */
     router.use('/users', userRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).send('Welcome :) Your application has been started successfully!'));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');

        logger.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    /**  Create and start the server */
    http.createServer(router).listen(config.server.port, () => logger.info(`Server is running on port ${config.server.port}`));
};


