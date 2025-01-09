const UNSPLASH_BASE_URL = 'https://images.unsplash.com';

const breweryTypeImages = {
  micro: 'photo-1532634740-6837b2a21d39', // Modern craft brewery
  nano: 'photo-1532634740-6837b2a21d39', // Same as micro
  regional: 'photo-1505075106905-fb052892c116', // Large brewery
  brewpub: 'photo-1546622891-02c72c1537b6', // Restaurant brewery
  large: 'photo-1505075106905-fb052892c116', // Large brewery
  bar: 'photo-1546622891-02c72c1537b6', // Bar setting
  proprietor: 'photo-1559526324-593bc073d938', // Default to craft brewery
  closed: 'photo-1559526324-593bc073d938', // Default to craft brewery
};

type BreweryType = keyof typeof breweryTypeImages;

export const getBreweryImage = (breweryType: string): string => {
  const photoId = breweryTypeImages[breweryType as BreweryType] || breweryTypeImages.micro;
  return `${UNSPLASH_BASE_URL}/${photoId}?auto=format&fit=crop&w=800&q=80`;
};