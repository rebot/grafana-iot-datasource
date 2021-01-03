import { DataQuery, DataSourceJsonData, SelectableValue } from '@grafana/data';

export interface MyQuery extends DataQuery {
  device: SelectableValue<string>;
  baudrate: number;
  frequency: number;
  path?: string;
}

export const defaultQuery: Partial<MyQuery> = {
  baudrate: 9600,
  frequency: 1.0,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
  resolution?: number;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

/**
 *
 */
