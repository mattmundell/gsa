/* Greenbone Security Assistant
 *
 * Authors:
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
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
import {_, _l} from 'gmp/locale/lang';

import {CERTBUND_FILTER_FILTER} from 'gmp/models/filter';

import SeverityClassDisplay from 'web/components/dashboard/display/severity/severityclassdisplay'; // eslint-disable-line max-len
import SeverityClassTableDisplay from 'web/components/dashboard/display/severity/severityclasstabledisplay'; // eslint-disable-line max-len
import createDisplay from 'web/components/dashboard/display/createDisplay';
import {registerDisplay} from 'web/components/dashboard/registry';

import {CertBundSeverityLoader} from './loaders';

export const CertBundSeverityClassDisplay = createDisplay({
  loaderComponent: CertBundSeverityLoader,
  displayComponent: SeverityClassDisplay,
  title: ({data: tdata}) =>
    _('CERT-Bund Advisories by Severity Class (Total: {{count}})',
      {count: tdata.total}),
  displayId: 'cert_bund_adv-by-severity-class',
  displayName: 'CertBundSeverityClassDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

export const CertBundSeverityClassTableDisplay = createDisplay({
  loaderComponent: CertBundSeverityLoader,
  displayComponent: SeverityClassTableDisplay,
  title: ({data: tdata}) =>
    _('CERT-Bund Advisories by Severity Class (Total: {{count}})',
      {count: tdata.total}),
  dataTitles: [
    _l('Severity Class'),
    _l('# of CERT-Bund Advisories'),
  ],
  displayId: 'cert_bund_adv-by-severity-table',
  displayName: 'CertBundSeverityClassTableDisplay',
  filtersFilter: CERTBUND_FILTER_FILTER,
});

registerDisplay(
  CertBundSeverityClassDisplay.displayId,
  CertBundSeverityClassDisplay, {
  title: _l('Chart: CERT-Bund Advisories by Severity Class'),
});

registerDisplay(CertBundSeverityClassTableDisplay.displayId,
  CertBundSeverityClassTableDisplay, {
    title: _l('Table: CERT-Bund Advisories by Severity Class'),
  },
);

// vim: set ts=2 sw=2 tw=80:
