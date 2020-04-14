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
