import { ReactNode } from 'react';

type Value = any;
export interface State {
  [key: string]: any; // TODO
}

export interface FormProps {
  children?: ReactNode;
  connect?(store: any): void;
  id?: string;
}

export interface Field {
  id?: string;
  name?: string;
  value?: Value;
}
