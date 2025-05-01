
const mockCountries = [
    {
      name: { common: 'India', official: 'Republic of India' },
      capital: ['New Delhi'],
      population: 1393409038,
      region: 'Asia',
      flags: { png: 'https://flagcdn.com/w320/in.png' },
      languages: { eng: 'English', hin: 'Hindi' },
      latlng: [20.5937, 78.9629],
      cca3: 'IND',
    },
    {
      name: { common: 'United States', official: 'United States of America' },
      capital: ['Washington D.C.'],
      population: 331000000,
      region: 'Americas',
      flags: { png: 'https://flagcdn.com/w320/us.png' },
      languages: { eng: 'English' },
      latlng: [37.0902, -95.7129],
      cca3: 'USA',
    },
  ];
  
  const mockNotes = [
    { _id: 'n1', countryCode: 'IND', countryName: 'India', text: 'Visited in 2023' },
    { _id: 'n2', countryCode: 'JPN', countryName: 'Japan', text: 'Bucket list' },
  ];
  
  const mockFavorites = [
    { _id: '1', countryCode: 'IND', countryName: 'India' },
    { _id: '2', countryCode: 'USA', countryName: 'United States' },
  ];
  
  const axios = {
    create: () => axios, // to support API = axios.create()
  
    get: jest.fn((url) => {
      if (url.includes('/all')) {
        return Promise.resolve({ data: mockCountries });
      }
      if (url.includes('/favorites')) {
        return Promise.resolve({ data: mockFavorites });
      }
      if (url.includes('/notes')) {
        return Promise.resolve({ data: mockNotes });
      }
      if (url.includes('/alpha/')) {
        const code = url.split('/').pop().toUpperCase();
        const result = mockCountries.filter((c) => c.cca3 === code);
        return Promise.resolve({ data: result });
      }
      if (url.includes('/name/')) {
        const name = url.split('/').pop().toLowerCase();
        const result = mockCountries.filter((c) =>
          c.name.common.toLowerCase().includes(name)
        );
        return Promise.resolve({ data: result });
      }
      if (url.includes('/region/')) {
        const region = url.split('/').pop();
        const result = mockCountries.filter((c) => c.region === region);
        return Promise.resolve({ data: result });
      }
      if (url.includes('/lang/')) {
        const lang = url.split('/').pop();
        const result = mockCountries.filter((c) =>
          Object.values(c.languages).map((l) => l.toLowerCase()).includes(lang)
        );
        return Promise.resolve({ data: result });
      }
      return Promise.resolve({ data: [] });
    }),
  
    post: jest.fn((url) => {
      if (url.includes('/login')) {
        return Promise.resolve({
          data: {
            token: 'test-token',
            user: { id: 'u123', email: 'test@email.com' },
          },
        });
      }
      return Promise.resolve({ data: {} });
    }),
  
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  };
  
  export default axios;
  