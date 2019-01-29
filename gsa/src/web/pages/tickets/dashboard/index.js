/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import Dashboard from 'web/components/dashboard/dashboard';

import {TicketsStatusDisplay, TicketsStatusTableDisplay} from './statusdisplay';
import {
  TicketsAssignedUsersDisplay,
  TicketsAssignedUsersTableDisplay,
} from './usersassigneddisplay';
import {
  TicketsCreatedDisplay,
  TicketsCreatedTableDisplay,
} from './createddisplay';

export const TICKETS_DASHBOARD_ID = '70b0626f-a835-478e-8194-e09f97887a15';

const TICKETS_DISPLAYS = [
  TicketsAssignedUsersDisplay.displayId,
  TicketsCreatedDisplay.displayId,
  TicketsStatusDisplay.displayId,
  TicketsAssignedUsersTableDisplay.displayId,
  TicketsCreatedTableDisplay.displayId,
  TicketsStatusTableDisplay.displayId,
];

const TicketsDashboard = props => (
  <Dashboard
    {...props}
    id={TICKETS_DASHBOARD_ID}
    permittedDisplays={TICKETS_DISPLAYS}
    defaultDisplays={[
      [
        TicketsStatusDisplay.displayId,
        TicketsAssignedUsersDisplay.displayId,
        TicketsCreatedDisplay.displayId,
      ],
    ]}
  />
);

export default TicketsDashboard;

// vim: set ts=2 sw=2 tw=80:
