import { PROTOCOLS_DATA as PROTOCOLS_LIST } from './protocolsList.js';

export interface Protocol {
  id: string;
  name: string;
  fullName: string;
  category: 'routing' | 'security' | 'infra' | 'transport';
  layer: string;
  port: string;
  rfc?: string;
  shortDesc: string;
  practicalRole: string;
  securityNote: string;
}

export const PROTOCOLS_DATA: Protocol[] = PROTOCOLS_LIST as Protocol[];
