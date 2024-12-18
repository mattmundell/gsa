/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';
import styled from 'styled-components';
import {FoldState} from 'web/components/folding/folding';
import EditIcon from 'web/components/icon/editicon';
import Section from 'web/components/section/section';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import TableHead from 'web/components/table/head';
import TableHeader from 'web/components/table/header';
import TableRow from 'web/components/table/row';
import Table from 'web/components/table/stripedtable';
import useTranslation from 'web/hooks/useTranslation';
import PropTypes from 'web/utils/proptypes';

const StyledTableData = styled(TableData)`
  overflow-wrap: break-word;
`;

const shouldComponentUpdate = (props, nextProps) =>
  nextProps.preference !== props.preference;

const NvtPreferenceDisplay = React.memo(
  ({preference, onEditNvtDetailsClick, title}) => {
    return (
      <TableRow>
        <StyledTableData>{preference.nvt.name}</StyledTableData>
        <StyledTableData>{preference.name}</StyledTableData>
        <StyledTableData>{preference.value}</StyledTableData>
        <TableData align={['center', 'center']}>
          <EditIcon
            title={title}
            value={preference.nvt.oid}
            onClick={onEditNvtDetailsClick}
          />
        </TableData>
      </TableRow>
    );
  },
  shouldComponentUpdate,
);

export const NvtPreferencePropType = PropTypes.shape({
  nvt: PropTypes.shape({
    oid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
});

NvtPreferenceDisplay.propTypes = {
  preference: NvtPreferencePropType.isRequired,
  title: PropTypes.string.isRequired,
  onEditNvtDetailsClick: PropTypes.func.isRequired,
};

const NvtPreferences = ({
  editTitle,
  preferences = [],
  onEditNvtDetailsClick,
}) => {
  const [_] = useTranslation();
  return (
    <Section
      foldable
      initialFoldState={FoldState.FOLDED}
      title={_('Network Vulnerability Test Preferences ({{counts}})', {
        counts: preferences.length,
      })}
    >
      <Table fixed>
        <TableHeader>
          <TableRow>
            <TableHead width="30%">{_('NVT')}</TableHead>
            <TableHead width="30%">{_('Name')}</TableHead>
            <TableHead width="30%">{_('Value')}</TableHead>
            <TableHead align="center" width="10%">
              {_('Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preferences.map(pref => (
            <NvtPreferenceDisplay
              key={pref.nvt.name + pref.name}
              preference={pref}
              title={editTitle}
              onEditNvtDetailsClick={onEditNvtDetailsClick}
            />
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};

NvtPreferences.propTypes = {
  editTitle: PropTypes.string,
  preferences: PropTypes.arrayOf(NvtPreferencePropType),
  onEditNvtDetailsClick: PropTypes.func.isRequired,
};

export default NvtPreferences;
