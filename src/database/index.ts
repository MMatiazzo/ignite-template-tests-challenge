import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = "database"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.JWT_SECRET === "senhasupersecreta123" ? "localhost" : host,
      database: process.env.JWT_SECRET === "senhasupersecreta123" ? "fin_api" : defaultOptions.database
    })
  );
}