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
import {shortDate} from 'gmp/locale/date';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';
import {renderComponent, renderYesNo} from 'web/utils/render';

import EntityNameTableData from 'web/entities/entitynametabledata';
import {withEntityActions} from 'web/entities/actions';
import {withEntityRow} from 'web/entities/row';

import Comment from 'web/components/comment/comment';

import CloneIcon from 'web/entity/icon/cloneicon';
import EditIcon from 'web/entity/icon/editicon';
import TrashIcon from 'web/entity/icon/trashicon';

import ExportIcon from 'web/components/icon/exporticon';
import Icon from 'web/components/icon/icon';

import IconDivider from 'web/components/layout/icondivider';

import TableData from 'web/components/table/data';
import TableRow from 'web/components/table/row';

const Actions = withCapabilities(({
  capabilities,
  entity,
  onReportFormatCloneClick,
  onReportFormatDeleteClick,
  onReportFormatDownloadClick,
  onReportFormatEditClick,
  onReportFormatVerifyClick,
}) => (
  <IconDivider
    align={['center', 'center']}
    grow
  >
    <TrashIcon
      displayName={_('Report Format')}
      name="report_format"
      entity={entity}
      onClick={onReportFormatDeleteClick}
    />
    <EditIcon
      displayName={_('Report Format')}
      name="report_format"
      entity={entity}
      onClick={onReportFormatEditClick}
    />
    <CloneIcon
      displayName={_('Report Format')}
      name="report_format"
      entity={entity}
      title={_('Clone Report Format')}
      value={entity}
      onClick={onReportFormatCloneClick}
    />
    <ExportIcon
      value={entity}
      title={_('Export Report Format')}
      onClick={onReportFormatDownloadClick}
    />
    {capabilities.mayOp('verify_report_format') ?
      <Icon
        img="verify.svg"
        value={entity}
        title={_('Verify Report Format')}
        onClick={onReportFormatVerifyClick}
      /> :
      <Icon
        img="verify_inactive.svg"
        title={_('Permission to verify Report Format denied')}
      />
    }
  </IconDivider>
));

Actions.propTypes = {
  entity: PropTypes.model.isRequired,
  onReportFormatCloneClick: PropTypes.func.isRequired,
  onReportFormatDeleteClick: PropTypes.func.isRequired,
  onReportFormatDownloadClick: PropTypes.func.isRequired,
  onReportFormatEditClick: PropTypes.func.isRequired,
  onReportFormatVerifyClick: PropTypes.func.isRequired,
};

const Row = ({
  actions,
  entity,
  links = true,
  onToggleDetailsClick,
  ...props
}) => (
  <TableRow>
    <EntityNameTableData
      entity={entity}
      links={links}
      type="reportformat"
      displayName={_('Report Format')}
      onToggleDetailsClick={onToggleDetailsClick}
    >
      {entity.summary &&
        <Comment>({entity.summary})</Comment>
      }
    </EntityNameTableData>
    <TableData>
      {entity.extension}
    </TableData>
    <TableData>
      {entity.content_type}
    </TableData>
    <TableData flex="column">
      <span>
        {renderYesNo(entity.trust.value)}
      </span>
      {entity.trust.time &&
        <span>({shortDate(entity.trust.time)})</span>
      }
    </TableData>
    <TableData>
      {renderYesNo(entity.isActive())}
    </TableData>
    {renderComponent(actions, {...props, entity})}
  </TableRow>
);

Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: PropTypes.model.isRequired,
  links: PropTypes.bool,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default withEntityRow(withEntityActions(Actions))(Row);

// vim: set ts=2 sw=2 tw=80:
