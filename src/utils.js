export const computeDuration = (timeToElapse, periodType) => {
  switch (periodType) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

export const nPercentageOf = (n, amount) => Math.trunc((n / 100) * amount);

export const factorOf = (n) => Math.trunc(n / 3);

export const computeInfectionsByRequestedTime = (currentlyInfected, duration) => {
  const factor = factorOf(duration);
  return currentlyInfected * (2 ** factor);
};

export const computeDollarsInFlight = (
  infectionsByRequestedTime,
  avgDailyIncomeInUSD,
  avgDailyIncomePopulation,
  duration
) => Math.trunc(
  (infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD) / duration
);

export const computeHospitalBedsByRequestedTime = (
  totalHospitalBeds,
  severeCasesByRequestedTime
) => Math.trunc(((35 / 100) * totalHospitalBeds) - severeCasesByRequestedTime);

export const OBJtoXML = (obj, root = true) => {
  let xml = '';
  if (root) {
    xml += '<?xml version="1.0" encoding="UTF-8" ?>';
    xml += '<root>';
  }
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in obj) {
    xml += obj[prop] instanceof Array ? '' : `<${prop}>`;
    if (obj[prop] instanceof Array) {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const array in obj[prop]) {
        xml += `<${prop}>`;
        xml += OBJtoXML({ ...obj[prop][array] }, false);
        xml += `</${prop}>`;
      }
    } else if (typeof obj[prop] === 'object') {
      xml += OBJtoXML({ ...obj[prop] }, false);
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? '' : `</${prop}>`;
  }
  if (root) {
    xml += '</root>';
  }
  xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml;
};
