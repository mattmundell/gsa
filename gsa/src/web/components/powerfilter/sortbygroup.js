/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 - 2018 Greenbone Networks GmbH
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

import _ from 'gmp/locale';

import {isDefined} from 'gmp/utils/identity';

import PropTypes from '../../utils/proptypes.js';

import FormGroup from '../form/formgroup.js';
import Radio from '../form/radio.js';
import Select from '../form/select.js';

class SortByGroup extends React.Component {

  renderSortFieldItems() {
    const {fields = []} = this.props;
    return fields.map(([value, label]) => ({
      value,
      label,
    }));
  }

  render() {
    let {by, order, filter, onSortByChange, onSortOrderChange} = this.props;

    if (isDefined(filter)) {
      by = filter.getSortBy();
      order = filter.getSortOrder();
    }
    return (
      <FormGroup title={_('Sort by')}>
        <Select
          name="sort_by"
          value={by}
          items={this.renderSortFieldItems()}
          onChange={onSortByChange}
        />
        <Radio
          name="sort_order"
          value="sort"
          checked={order === 'sort'}
          title={_('Ascending')}
          onChange={onSortOrderChange}
        />
        <Radio
          name="sort_order"
          value="sort-reverse"
          checked={order === 'sort-reverse'}
          title={_('Descending')}
          onChange={onSortOrderChange}
        />
      </FormGroup>
    );
  }
}

SortByGroup.propTypes = {
  by: PropTypes.string,
  fields: PropTypes.array,
  filter: PropTypes.filter,
  order: PropTypes.oneOf(['sort', 'sort-reverse']),
  onSortByChange: PropTypes.func,
  onSortOrderChange: PropTypes.func,
};


export default SortByGroup;

// vim: set ts=2 sw=2 tw=80:
