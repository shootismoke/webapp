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

import { jest } from '@jest/globals';
import { config } from 'dotenv';

// The e2e specs talk to a running Next server and, for the fixtures, to Mongo
// directly -- so they need the same BACKEND_* values the server was started
// with. Next reads .env itself; jest does not, hence this.
config({ path: '.env' });

// Every spec sets this itself, but from inside `beforeAll`, which is too late
// to cover the hook it is written in: seeding fixtures against a dev server
// that compiles each route on first request blows well past jest's 5s default,
// and the suite fails in `beforeAll` before a single test runs. Setting it here
// applies to the hooks too.
jest.setTimeout(30000);
