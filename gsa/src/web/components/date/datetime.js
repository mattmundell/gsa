/* Copyright (C) 2019-2020 Greenbone Networks GmbH
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
import {dateTimeWithTimeZone, ensureDate} from 'gmp/locale/date';

import {isDefined, hasValue} from 'gmp/utils/identity';

import PropTypes from 'web/utils/proptypes';
import useUserTimezone from 'web/utils/useUserTimezone';

const DateTime = ({formatter = dateTimeWithTimeZone, timezone, date}) => {
  date = ensureDate(date);

  const userTimezone = useUserTimezone();

  if (!hasValue(timezone)) {
    timezone = userTimezone;
  }
  return !isDefined(date) || !date.isValid() ? null : formatter(date, timezone);
};

DateTime.propTypes = {
  date: PropTypes.date,
  formatter: PropTypes.func,
  timezone: PropTypes.string,
};

export default DateTime;
