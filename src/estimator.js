import {
  computeDollarsInFlight,
  computeDuration,
  computeHospitalBedsByRequestedTime,
  computeInfectionsByRequestedTime,
  nPercentageOf
} from './utils';

const estimate = ({
  reportedCases,
  timeToElapse,
  periodType,
  totalHospitalBeds,
  region: {
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation
  }
}, rate) => {
  const currentlyInfected = reportedCases * rate;
  const duration = computeDuration(timeToElapse, periodType);
  const infectionsByRequestedTime = computeInfectionsByRequestedTime(currentlyInfected, duration);
  const severeCasesByRequestedTime = nPercentageOf(15, infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = computeHospitalBedsByRequestedTime(
    totalHospitalBeds, severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = nPercentageOf(5, infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = nPercentageOf(2, infectionsByRequestedTime);
  const dollarsInFlight = computeDollarsInFlight(
    infectionsByRequestedTime,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    duration
  );
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => ({
  impact: estimate(data, 10),
  severeImpact: estimate(data, 50)
});

export default covid19ImpactEstimator;
