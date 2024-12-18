/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {_, _l} from 'gmp/locale/lang';
import React from 'react';
import styled from 'styled-components';
import DateTime from 'web/components/date/datetime';
import DownloadIcon from 'web/components/icon/downloadicon';
import Link from 'web/components/link/link';
import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';
import {RowDetailsToggle} from 'web/entities/row';
import {createEntitiesTable} from 'web/entities/table';
import withRowDetails from 'web/entities/withRowDetails';
import PropTypes from 'web/utils/proptypes';
import {formattedUserSettingShortDate} from 'web/utils/userSettingTimeDateFormatters';

import TlsCertificateDetails from '../../tlscertificates/details';

const Header = ({
  actions = true,
  currentSortDir,
  currentSortBy,
  sort = true,
  onSortChange,
}) => {
  const sortProps = {
    currentSortDir,
    currentSortBy,
    sort,
    onSortChange,
  };
  return (
    <TableHeader>
      <TableRow>
        <TableHead
          {...sortProps}
          sortBy="dn"
          title={_('Subject DN')}
          width={actions ? '35%' : '40%'}
        />
        <TableHead
          {...sortProps}
          sortBy="serial"
          title={_('Serial')}
          width="10%"
        />
        <TableHead
          {...sortProps}
          sortBy="notvalidbefore"
          title={_('Activates')}
          width="10%"
        />
        <TableHead
          {...sortProps}
          sortBy="notvalidafter"
          title={_('Expires')}
          width="10%"
        />
        <TableHead {...sortProps} sortBy="ip" title={_('IP')} width="10%" />
        <TableHead
          {...sortProps}
          sortBy="hostname"
          title={_('Hostname')}
          width="15%"
        />
        <TableHead {...sortProps} sortBy="port" title={_('Port')} width="5%" />
        {actions && (
          <TableHead align="center" width="5%">
            {_('Actions')}
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

Header.propTypes = {
  actions: PropTypes.bool,
  currentSortBy: PropTypes.string,
  currentSortDir: PropTypes.string,
  sort: PropTypes.bool,
  onSortChange: PropTypes.func,
};

const Div = styled.div`
  word-break: break-all;
`;

const StyledSpan = styled.span`
  word-break: break-all;
`;

const Row = ({
  actions = true,
  entity,
  links = true,
  onTlsCertificateDownloadClick,
  onToggleDetailsClick,
}) => {
  const {serial, activationTime, expirationTime, hostname, ip, port} = entity;
  return (
    <TableRow>
      <TableData>
        <StyledSpan>
          <RowDetailsToggle name={entity.id} onClick={onToggleDetailsClick}>
            <Div>{entity.subjectDn}</Div>
          </RowDetailsToggle>
        </StyledSpan>
      </TableData>
      <TableData>{serial}</TableData>
      <TableData>
        <DateTime
          date={activationTime}
          format={formattedUserSettingShortDate}
        />
      </TableData>
      <TableData>
        <DateTime
          date={expirationTime}
          format={formattedUserSettingShortDate}
        />
      </TableData>
      <TableData>
        <Link
          filter={'name=' + ip}
          textOnly={!links}
          title={_('Show all Hosts with IP {{ip}}', {ip})}
          to="hosts"
        >
          {ip}
        </Link>
      </TableData>
      <TableData>{hostname}</TableData>
      <TableData>{port}</TableData>
      {actions && (
        <TableData align={['center', 'center']}>
          <DownloadIcon
            title={_('Download TLS Certificate')}
            value={entity}
            onClick={onTlsCertificateDownloadClick}
          />
        </TableData>
      )}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  links: PropTypes.bool,
  onTlsCertificateDownloadClick: PropTypes.func,
  onToggleDetailsClick: PropTypes.func.isRequired,
};

export default createEntitiesTable({
  header: Header,
  emptyTitle: _l('No TLS Certificates available'),
  row: Row,
  rowDetails: withRowDetails('tlscertificate', 6, false)(TlsCertificateDetails),
});
