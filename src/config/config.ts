import { ConfigModuleOptions } from '@nestjs/config';

export enum ServerEnv {
  Development = 'development',
  Production = 'production',
}

export interface ConfigAttributes {
  port: number;
  database: {
    uri: string;
  };
  serverEnv: ServerEnv;
 
  jwt: {
    secret: string;
    expiresIn: string;
  };
 
}


const configuration = (): ConfigAttributes => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaiter',
  },
  serverEnv: (process.env.NODE_ENV as ServerEnv) || ServerEnv.Development,
 
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
  
});



export const configOpts: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  load: [configuration],
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
};
