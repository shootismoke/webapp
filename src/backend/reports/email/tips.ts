/**
 * This file is part of Sh**t! I Smoke.
 *
 * Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Health tips depending on AQI.
 * This component is the pure HTML equivalent of the <Tips /> component.
 *
 * @param aqi - Air Quality Index.
 * @see https://taqm.epa.gov.tw/taqm/en/b0201.html
 */
export function tips(aqi: number): string[] {
	if (aqi <= 50) {
		return [
			`Air quality is considered <span style="color: #f2934e;">satisfactory</span>, and air pollution poses little or no risk.`,
			`<span style="color: #f2934e;">Enjoy</span> your usual outdoor activities.`,
		];
	} else if (aqi <= 100) {
		return [
			`Air quality is <span style="color: #f2934e;">acceptable.</span> Enjoy your usual outdoor activities.`,
			`For some pollutants there may be a <span style="color: #f2934e;">moderate health concern</span> for a very small number of people who are unusually sensitive to air pollution.`,
		];
	} else if (aqi <= 150) {
		return [
			`Experiencing discomfort such as sore eyes, cough or sore throat? <span style="color: #f2934e;"> Consider reducing outdoor activities.</span>`,
			`It’s ok to be active outside, but we recommended to <span style="color: #f2934e;"> avoid prolonged strenuous exercise.</span>`,
		];
	} else if (aqi <= 200) {
		return [
			`Everyone experiencing discomfort such as sore eyes, cough or sore throat <span style="color: #f2934e;"> should reduce physical exertion, particularly outdoors.</span>`,
			`Avoid prolonged strenuous exercise, and <span style="color: #f2934e;">take more breaks</span> during outdoor activities.`,
		];
	} else if (aqi <= 300) {
		return [
			`span style="color: #f2934e;">Health alert:</span> everyone may experience more serious health effects.`,
			`Everyone should <span style="color: #f2934e;"> reduce outdoor activities,</span> especially vulnerable people.`,
		];
	} else {
		return [
			`span style="color: #f2934e;">Health alert:</span> Stop outdoor activities and move all activities indoors.`,
			`If it is necessary to go out, please <span style="color: #f2934e;">wear a mask</span>.`,
		];
	}
}
