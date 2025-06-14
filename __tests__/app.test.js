import { describe, expect, it } from 'vitest';
import { parseWeather } from '../js/app.js';

describe('parseWeather', () => {
  it('extracts current weather fields', () => {
    const json = {
      current_weather: {
        temperature: 20,
        windspeed: 10,
        weathercode: 0,
        time: '2025-06-14T16:00'
      }
    };
    expect(parseWeather(json)).toEqual({
      temperature: 20,
      windspeed: 10,
      weathercode: 0,
      time: '2025-06-14T16:00'
    });
  });

  it('throws when current_weather is missing', () => {
    expect(() => parseWeather({})).toThrow();
  });
});
