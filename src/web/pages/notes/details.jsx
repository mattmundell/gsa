/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import HorizontalSep from 'web/components/layout/horizontalsep';
import Layout from 'web/components/layout/layout';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import InfoTable from 'web/components/table/infotable';
import TableRow from 'web/components/table/row';
import DetailsBlock from 'web/entity/block';
import EntityLink from 'web/entity/link';
import NoteBox from 'web/entity/note';
import {Col} from 'web/entity/page';
import PropTypes from 'web/utils/proptypes';
import {
  translatedResultSeverityRiskFactor,
  LOG_VALUE,
} from 'web/utils/severity';

const NoteDetails = ({entity}) => {
  const {hosts, port, result, severity, task} = entity;
  return (
    <Layout flex="column" grow="1">
      <DetailsBlock title={_('Application')}>
        <InfoTable size="full">
          <colgroup>
            <Col width="10%" />
            <Col width="90%" />
          </colgroup>
          <TableBody>
            <TableRow>
              <TableData>{_('Hosts')}</TableData>
              <TableData>
                {hosts.length > 0 ? (
                  <HorizontalSep>
                    {hosts.map(host => (
                      <span key={host}>{host}</span>
                    ))}
                  </HorizontalSep>
                ) : (
                  _('Any')
                )}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('Port')}</TableData>
              <TableData>{isDefined(port) ? port : _('Any')}</TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('Severity')}</TableData>
              <TableData>
                {isDefined(severity)
                  ? severity > LOG_VALUE
                    ? _('> 0.0')
                    : translatedResultSeverityRiskFactor(severity)
                  : _('Any')}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('Task')}</TableData>
              <TableData>
                {entity.isOrphan() ? (
                  <b>{_('Orphan')}</b>
                ) : isDefined(task) ? (
                  <span>
                    <EntityLink entity={task} />
                  </span>
                ) : (
                  _('Any')
                )}
              </TableData>
            </TableRow>

            <TableRow>
              <TableData>{_('Result')}</TableData>
              <TableData>
                {entity.isOrphan() ? (
                  <b>{_('Orphan')}</b>
                ) : isDefined(result) ? (
                  <span>
                    <EntityLink entity={result} />
                  </span>
                ) : (
                  _('Any')
                )}
              </TableData>
            </TableRow>
          </TableBody>
        </InfoTable>
      </DetailsBlock>

      <DetailsBlock
        title={
          entity.isActive() ? _('Appearance') : _('Appearance when active')
        }
      >
        <NoteBox detailsLink={false} note={entity} />
      </DetailsBlock>
    </Layout>
  );
};

NoteDetails.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default NoteDetails;
