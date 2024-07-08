export interface IPlantApiData {
  Categories: string;
  Disease: string;
  Img: string;
  Use: string[];
  "Latin name": string;
  Insects: string[];
  Avaibility: string;
  Style: null;
  Bearing: string;
  "Light tolered": string;
  "Height at purchase": { M: number | undefined; CM: number | undefined };
  "Light ideal": string;
  "Width at purchase": { M: number | undefined; CM: number | undefined };
  id: string;
  Appeal: string;
  Perfume: null;
  Growth: string;
  "Width potential": { M: number | undefined; CM: number | undefined };
  "Common name (fr.)": string;
  Pruning: string;
  Family: string;
  "Height potential": { M: number | undefined; CM: number | undefined };
  Origin: string[];
  Description: null;
  "Temperature max": { F: number | undefined; C: number | undefined };
  "Blooming season": string;
  Url: string;
  "Color of leaf": string[];
  Watering: string;
  "Color of blooms": string;
  Zone: string[];
  "Common name": string[];
  "Available sizes (Pot)": string;
  "Other names": string;
  "Temperature min": { F: number | undefined; C: number | undefined };
  "Pot diameter (cm)": { M: number | undefined; CM: number | undefined };
  Climat: string;
}

export interface ILitePlantApiData {
  Categories: string;
  "Common name (fr.)": string;
  Img: string;
  Zone: string[];
  Family: string;
  "Common name": string[];
  "Latin name": string;
  "Other names": string;
  Description: null;
  Origin: string[];
  id: string;
  Climat: string;
}

export const isIPlantApiData = (
  item: false | IPlantApiData
): item is IPlantApiData => {
  return item !== false;
};

export interface IIdentifiedPlant {
  score: number;
  species: {
    scientificNameWithoutAuthor: string;
    scientificNameAuthorship: string;
    scientificName: string;
    genus: {
      scientificNameWithoutAuthor: string;
      scientificNameAuthorship: string;
      scientificName: string;
    };
    family: {
      scientificNameWithoutAuthor: string;
      scientificNameAuthorship: string;
      scientificName: string;
    };
    commonNames: string[];
  };
  gbif: {
    id: 0;
  };
  powo: {
    id: string;
  };
  iucn: {
    id: string;
    category: string;
  };
}
export interface IIdentificationPlantApiData {
  query: {
    project: string;
    images: string[];
    organs: string[];
    includeRelatedImages: boolean;
    noReject: boolean;
  };
  language: string;
  preferedReferential: string;
  switchToProject: string;
  bestMatch: string;
  results: IIdentifiedPlant[];
  remainingIdentificationRequests: number;
  version: string;
}

export interface IPlant {
  name: string;
  commonName: string;
  availability: string;
  lightTolerated: string;
  lightIdeal: string;
  temperatureMax: number;
  temperatureMin: number;
  watering: string;
  climat: string;
}
