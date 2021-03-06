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

import PropTypes from 'web/utils/proptypes';
import {renderComponent} from 'web/utils/render';

import EntityNameTableData from 'web/entities/entitynametabledata';
import {withEntityActions} from 'web/entities/actions';
import {withEntityRow} from 'web/entities/row';

import CloneIcon from 'web/entity/icon/cloneicon';
import TrashIcon from 'web/entity/icon/trashicon';
import EditIcon from 'web/entity/icon/editicon';

import ExportIcon from 'web/components/icon/exporticon';

import IconDivider from 'web/components/layout/icondivider';

import TableRow from 'web/components/table/row';

const IconActions = ({
  entity,
  onRoleCloneClick,
  onRoleDeleteClick,
  onRoleDownloadClick,
  onRoleEditClick,
}) => (
  <IconDivider
    align={['center', 'center']}
    grow
  >
    <TrashIcon
      displayName={_('Role')}
      name="role"
      entity={entity}
      onClick={onRoleDeleteClick}
    />
    <EditIcon
      displayName={_('Role')}
      name="role"
      entity={entity}
      onClick={onRoleEditClick}
    />
    <CloneIcon
      displayName={_('Role')}
      name="user"
      entity={entity}
      title={_('Clone Role')}
      value={entity}
      onClick={onRoleCloneClick}
    />
    <ExportIcon
      value={entity}
      title={_('Export Role')}
      onClick={onRoleDownloadClick}
    />
  </IconDivider>
);

IconActions.propTypes = {
  entity: PropTypes.model,
  onRoleCloneClick: PropTypes.func,
  onRoleDeleteClick: PropTypes.func,
  onRoleDownloadClick: PropTypes.func,
  onRoleEditClick: PropTypes.func,
};

const Row = ({
  actions,
  entity,
  links = true,
  onToggleDetailsClick,
  ...props
}) => {
  return (
    <TableRow>
      <EntityNameTableData
        entity={entity}
        link={links}
        type="role"
        displayName={_('Role')}
        onToggleDetailsClick={onToggleDetailsClick}
      />
      {renderComponent(actions, {...props, entity})}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default withEntityRow(withEntityActions(IconActions))(Row);

// vim: set ts=2 sw=2 tw=80:
