import { configType, SetConfigType } from './public/types';
import { Logger } from './utils/logger';

let chate2eeConfig: configType = {
    apiURL: process.env.REACT_APP_API_URL || null,
    socketURL: process.env.REACT_APP_SOCKET_URL || null,
    settings: {
        disableLog: false // true - Disable Logs; false - Enable Logs
    }
};

export const setConfig: SetConfigType = (config) => {
    const logger = new Logger('Config').count();
    logger.log(`Overriding config`, config);
    chate2eeConfig = { ...chate2eeConfig, ...config };
};

export const configContext = (): configType => chate2eeConfig;
