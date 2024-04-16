/* Copyright (C) 2018-2022 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useCallback} from 'react';

import {isDefined} from 'gmp/utils/identity';

import {parseInt} from 'gmp/parser';

import Divider from 'web/components/layout/divider';

import ToggleButton from 'web/components/form/togglebutton';

import PropTypes from 'web/utils/proptypes';

import useTranslation from 'web/hooks/useTranslation';

const RANGE = [1, 2, 3, 4, 5, 6, 7];
const ROWS = [0, 1, 2, 3];

const MonthDaysSelect = ({disabled, onChange, value = [], name}) => {
  const [_] = useTranslation();

  const handleChange = useCallback(
    (val, valName) => {
      if (!isDefined(onChange)) {
        return;
      }

      const day = parseInt(valName);

      let newValue;
      if (val && !value.includes(day)) {
        newValue = [...value, day];
      } else if (!val && value.includes(day)) {
        newValue = value.filter(v => v !== day);
      } else {
        newValue = value;
      }

      if (newValue.length > 0) {
        // at least one day must be still selected
        onChange(newValue, name);
      }
    },
    [name, value, onChange],
  );

  return (
    <Divider flex="column">
      {ROWS.map(j => (
        <Divider key={j}>
          {RANGE.map(i => {
            const k = j * 7 + i;
            return (
              <ToggleButton
                name={'' + k}
                key={k}
                checked={value.includes(k)}
                disabled={disabled}
                onToggle={handleChange}
              >
                {k}
              </ToggleButton>
            );
          })}
        </Divider>
      ))}
      <Divider>
        <ToggleButton
          name="29"
          checked={value.includes(29)}
          disabled={disabled}
          onToggle={handleChange}
        >
          29
        </ToggleButton>
        <ToggleButton
          name="30"
          checked={value.includes(30)}
          disabled={disabled}
          onToggle={handleChange}
        >
          30
        </ToggleButton>
        <ToggleButton
          name="31"
          checked={value.includes(31)}
          disabled={disabled}
          onToggle={handleChange}
        >
          31
        </ToggleButton>
        <ToggleButton
          name="-1"
          checked={value.includes(-1)}
          disabled={disabled}
          width="64px"
          onToggle={handleChange}
        >
          {_('Last Day')}
        </ToggleButton>
      </Divider>
    </Divider>
  );
};

MonthDaysSelect.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func,
};

export default MonthDaysSelect;

// vim: set ts=2 sw=2 tw=80:
