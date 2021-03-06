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

import {longDate} from 'gmp/locale/date';

import PropTypes from 'web/utils/proptypes';
import {renderComponent} from 'web/utils/render';

import {withEntityRow, RowDetailsToggle} from 'web/entities/row';

import SeverityBar from 'web/components/bar/severitybar';

import SolutionTypeIcon from 'web/components/icon/solutiontypeicon';

import Divider from 'web/components/layout/divider';

import CveLink from 'web/components/link/cvelink';
import Link from 'web/components/link/link';

import TableRow from 'web/components/table/row';
import TableData from 'web/components/table/data';

const Row = ({
  entity,
  links = true,
  actions,
  onToggleDetailsClick,
  ...other
}) => {
  return (
    <TableRow>
      <TableData>
        <RowDetailsToggle
          name={entity.id}
          onClick={onToggleDetailsClick}
        >
          {entity.name}
        </RowDetailsToggle>
      </TableData>
      <TableData>
        <Link
          to="nvts"
          filter={'family="' + entity.family + '"'}
          textOnly={!links}
        >
          {entity.family}
        </Link>
      </TableData>
      <TableData>
        {longDate(entity.creationTime)}
      </TableData>
      <TableData>
        {longDate(entity.modificationTime)}
      </TableData>
      <TableData>
        <Divider wrap>
          {entity.cves.map(id => (
            <CveLink
              key={id}
              id={id}
              textOnly={!links}
            />
          ))}
        </Divider>
      </TableData>
      <TableData align="center">
        {entity && entity.tags &&
          <SolutionTypeIcon type={entity.tags.solution_type}/>
        }
      </TableData>
      <TableData>
        <SeverityBar severity={entity.severity}/>
      </TableData>
      <TableData align="end">
        {entity.qod && entity.qod.value} %
      </TableData>
      {renderComponent(actions, {...other, entity})}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default withEntityRow()(Row);

// vim: set ts=2 sw=2 tw=80:
