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

import {
	clickOnCityCard,
	redirectToFaq,
	searchCityWithGps,
	// searchCityWithSlug, // FIXME This test makes CI hang.
} from '../components';

const URL_PATH = '/';

describe('Homepage', () => {
	clickOnCityCard(URL_PATH);
	redirectToFaq(URL_PATH);
	searchCityWithGps(URL_PATH);
	// searchCityWithSlug,

	it('h1 is visible', () => {
		cy.visit(URL_PATH);

		cy.get('h1').should('be.visible').should('contain', 'How much am I');
	});
});
