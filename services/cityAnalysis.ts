import { CityData, Category } from '../types';

/**
 * Static template-based city analysis — no API key required.
 * Returns a formatted analysis string for a given city.
 */
export function getCityAnalysis(city: CityData): string {
  const economy = city.metrics[Category.ECONOMY];
  const governance = city.metrics[Category.GOVERNANCE];
  const ecology = city.metrics[Category.ECOLOGY];
  const infrastructure = city.metrics[Category.INFRASTRUCTURE];

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (economy >= 70) strengths.push('розвинена економіка та ринок праці');
  else weaknesses.push('економічна активність потребує розвитку');

  if (governance >= 70) strengths.push('висока прозорість управління');
  else weaknesses.push('прозорість публічного управління має резерви для покращення');

  if (ecology >= 70) strengths.push('сприятливе екологічне середовище');
  else weaknesses.push('якість повітря та екологія потребують уваги');

  if (infrastructure >= 70) strengths.push('розвинена інфраструктура');
  else weaknesses.push('інфраструктура міста потребує модернізації');

  const scoreLabel =
    city.totalScore >= 800 ? 'лідер' :
    city.totalScore >= 600 ? 'вище середнього' :
    city.totalScore >= 400 ? 'середній рівень' : 'потенціал для зростання';

  const strengthsText = strengths.length
    ? `Сильні сторони: ${strengths.join(', ')}.`
    : '';

  const weaknessesText = weaknesses.length
    ? `Напрями для розвитку: ${weaknesses.join(', ')}.`
    : '';

  return [
    `${city.name} — місто ${scoreLabel} розвитку за Індексом якості життя.`,
    '',
    strengthsText,
    weaknessesText,
    '',
    `Загальний бал: ${city.totalScore} з 1000. Населення: ${city.population.toLocaleString('uk-UA')} осіб.`,
    city.highlights?.length
      ? `Ключові переваги: ${city.highlights.join('; ')}.`
      : '',
  ].filter(Boolean).join('\n');
}
