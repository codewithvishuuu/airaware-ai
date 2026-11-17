export type PollutantKey =
  | "pm2_5"
  | "pm10"
  | "nitrogen_dioxide"
  | "sulphur_dioxide"
  | "carbon_monoxide"
  | "ozone";

export type Place = {
  name: string;
  admin?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
};

export type PollutantReading = {
  value: number | null;
  unit: string;
  usSubIndex: number | null;
};

export type Band = {
  key: string;
  label: string;
  min: number;
  max: number;
  color: string;
  soft: string;
  border: string;
  guidance: string;
  activity: string;
};

export type CpcbResult = {
  aqi: number;
  band: Band;
  subIndices: Partial<Record<PollutantKey, number>>;
  sampleSize: number;
  dominant: PollutantKey | null;
};

export type Weather = {
  temperatureC: number | null;
  humidityPct: number | null;
  windKph: number | null;
  windDeg: number | null;
  windCompass: string | null;
};

export type AirData = {
  place: Place;
  observedAt: string;
  timezone: string;
  usAqi: number | null;
  usBand: Band | null;
  cpcb: CpcbResult | null;
  pollutants: Record<PollutantKey, PollutantReading>;
  weather: Weather | null;
  history: { time: string[]; pm25: (number | null)[] };
  stale: boolean;
  fetchedAt: string;
};

export type Recommendation = {
  slot: string;
  action: string;
  why: string;
  benefit: string;
  difficulty: "easy" | "moderate" | "hard";
  limitations: string;
};

export type RecommendationSet = {
  summary: string;
  items: Recommendation[];
};
