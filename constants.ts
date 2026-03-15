import { CityData, Category } from './types';
import citiesRaw from './data/cities.json';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ECONOMY]: '#0ea5e9',       // Sky 500
  [Category.GOVERNANCE]: '#ea580c',    // Violet 500
  [Category.ECOLOGY]: '#10b981',       // Emerald 500
  [Category.INFRASTRUCTURE]: '#f59e0b', // Amber 500
};

// Cast from JSON — update data/cities.json to add/edit cities
export const CITIES_DATA: CityData[] = citiesRaw as unknown as CityData[];

// Static coat of arms from Wikimedia Commons (city id → URL)
const WC = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=400`;

export const CITY_COAT_OF_ARMS: Record<string, string> = {
  'kyiv': 'coats/kyiv.png',
  'lviv': 'coats/lviv.png',
  'vinnytsia': 'coats/vinnytsia.png',
  'chernivtsi': 'coats/chernivtsi.png',
  'ivano-frankivsk': 'coats/ivano-frankivsk.png',
  'lutsk': 'coats/lutsk.png',
  'dnipro': 'coats/dnipro.png',
  'odesa': 'coats/odesa.png',
  'kharkiv': 'coats/kharkiv.png',
  'uzhhorod': 'coats/uzhhorod.png',
  'zhytomyr': 'coats/zhytomyr.png',
  'ternopil': 'coats/ternopil.png',
  'rivne': 'coats/rivne.png',
  'poltava': 'coats/poltava.png',
  'cherkasy': 'coats/cherkasy.png',
  'sumy': 'coats/sumy.png',
  'chernihiv': 'coats/chernihiv.png',
  'mykolaiv': 'coats/mykolaiv.png',
  'kherson': 'coats/kherson.png',
  // fallbacks (Wikimedia) for cities without local assets
  'khmelnytskyi': WC('Coat_of_Arms_of_Khmelnytskyi.svg'),
  'kropyvnytskyi': WC('Coat_of_Arms_of_Kropyvnytskyi.svg'),
  'zaporizhzhia': WC('Coat_of_Arms_of_Zaporizhzhia.svg'),
  'kryvyi-rih': WC('Coat_of_Arms_of_Kryvyi_Rih.svg'),
  'kremenchuk': WC('Coat_of_Arms_of_Kremenchuk.svg'),
  'bila-tserkva': WC('Coat_of_Arms_of_Bila_Tserkva.svg'),
  'kamianets-podilskyi': WC('Coat_of_Arms_of_Kamianets-Podilskyi.svg'),
  'mukachevo': WC('Coat_of_Arms_of_Mukachevo.svg'),
  'drohobych': WC('Coat_of_Arms_of_Drohobych.svg'),
  'uman': WC('Coat_of_arms_of_Uman.svg'),
  'brovary': WC('Coat_of_Arms_of_Brovary.svg'),
  'boryspil': WC('Coat_of_Arms_of_Boryspil.svg'),
  'irpin': WC('Coat_of_Arms_of_Irpin.svg'),
  'kovel': WC('Coat_of_Arms_of_Kovel.svg'),
  'kolomyia': WC('Coat_of_arms_of_Kolomyia.svg'),
  'stryi': WC('Coat_of_Arms_of_Stryi.svg'),
  'korosten': WC('Coat_of_arms_of_Korosten.svg'),
  'pavlohrad': WC('Coat_of_Arms_of_Pavlohrad.svg'),
  'nikopol': WC('Coat_of_Arms_of_Nikopol.svg'),
  'berdychiv': WC('Coat_of_Arms_of_Berdychiv.svg'),
  'novovolynsk': WC('Coat_of_Arms_of_Novovolynsk.svg'),
  'izmail': WC('Coat_of_Arms_of_Izmail.svg'),
  'konotop': WC('Coat_of_Arms_of_Konotop.svg'),
  'oleksandriia': WC('Coat_of_arms_of_Oleksandriia.svg'),
  'smila': WC('Coat_of_Arms_of_Smila.svg'),
  'nizhyn': 'coats/nizhyn.png',
  'shostka': WC('Coat_of_Arms_of_Shostka.svg'),
  'kalush': WC('Coat_of_Arms_of_Kalush.svg'),
  'pryluku': 'coats/prilyky.png',
  'samar': WC('Coat_of_Arms_of_Novomoskovsk.svg'),
  'lozova': 'coats/lozova.png',
  'izium': WC('Coat_of_Arms_of_Izium.svg'),
};
