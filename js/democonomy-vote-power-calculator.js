
giniCoefficient = stakes => {
  const sumOfDifferences = stakes.flatMap(v1 => stakes.map(v2 => v1.minus(v2).abs())).reduce((v1, v2) => v1.plus(v2))
  const mean = stakes.reduce((v1, v2) => v1.plus(v2)).dividedBy(new Decimal(stakes.length))
  const coef = sumOfDifferences.dividedBy(mean.mul(new Decimal((2 * Math.pow(stakes.length, 2)).toString())));
  return coef;
};

const getVotePowerCalculator = (Decimal, stakes) => stake => {
  stakes = stakes.map(v => new Decimal(v));
  const giniCoef = giniCoefficient(stakes);
  const totalStakes = stakes.reduce((v1, v2) => v1.plus(v2));
  const votingParticipancePower = new Decimal((1.0 / stakes.length).toString());
  const result = giniCoef.mul(votingParticipancePower).plus(new Decimal("1").minus(giniCoef).mul(new Decimal(stake.toString())).dividedBy(totalStakes, 4));
  return result;
};




