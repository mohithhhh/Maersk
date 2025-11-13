export enum View {
  Chat,
  Geo,
  Trends,
  About,
}

export interface Kpi {
  title: string;
  value: string;
  change?: number;
}

export interface ChartData {
  type: 'bar' | 'line';
  labels: string[];
  values: number[];
  forecastValues?: number[]; // Added for forecasting
  title: string;
}

export interface MapData {
  highlightedStates: { [stateCode: string]: number };
  title: string;
}

export interface TextData {
  insights: string[];
}

export type VisualizationType = 'kpi' | 'chart' | 'map' | 'text' | 'error';

// Type to manage multi-turn conversations
export type AwaitingInputType = 
  | 'order_id_for_status' 
  | 'order_id_for_seller' 
  | 'customer_id_for_location'
  | 'seller_id_for_details' // New: for direct seller lookup
  | null;

export interface StructuredResponse {
    visualization: VisualizationType;
    data: Kpi[] | ChartData | MapData | TextData | { message: string };
    summary: string;
    followUpSuggestions?: string[];
    awaitingInput?: AwaitingInputType; // Used to signal that the AI needs more information
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  structuredContent?: StructuredResponse;
}