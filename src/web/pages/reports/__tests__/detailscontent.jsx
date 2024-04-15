/* Copyright (C) 2020-2022 Greenbone AG
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
import React from 'react';

import Capabilities from 'gmp/capabilities/capabilities';
import {setLocale} from 'gmp/locale/lang';

import Filter from 'gmp/models/filter';

import {setTimezone, setUsername} from 'web/store/usersettings/actions';

import {rendererWith} from 'web/utils/testing';

import {getMockReport} from 'web/pages/reports/__mocks__/mockreport';

import DetailsContent from '../detailscontent';

setLocale('en');

const filter = Filter.fromString(
  'apply_overrides=0 levels=hml rows=2 min_qod=70 first=1 sort-reverse=severity',
);

const filterWithName = Filter.fromElement({
  term:
    'apply_overrides=0 levels=hml rows=2 min_qod=70 first=1 sort-reverse=severity',
  name: 'foo',
  id: '123',
});

const resetFilter = Filter.fromString('first=1 sort-reverse=severity');

const caps = new Capabilities(['everything']);

const manualUrl = 'test/';

const currentSettings = vi.fn().mockResolvedValue({
  foo: 'bar',
});

const getReportComposerDefaults = vi.fn().mockResolvedValue({
  foo: 'bar',
});

describe('Report Details Content tests', () => {
  test('should render Report Details Content', () => {
    const onActivateTab = vi.fn();
    const onAddToAssetsClick = vi.fn();
    const onError = vi.fn();
    const onFilterAddLogLevelClick = vi.fn();
    const onFilterDecreaseMinQoDClick = vi.fn();
    const onFilterChanged = vi.fn();
    const onFilterCreated = vi.fn();
    const onFilterEditClick = vi.fn();
    const onFilterRemoveSeverityClick = vi.fn();
    const onFilterResetClick = vi.fn();
    const onFilterRemoveClick = vi.fn();
    const onInteraction = vi.fn();
    const onRemoveFromAssetsClick = vi.fn();
    const onReportDownloadClick = vi.fn();
    const showError = vi.fn();
    const showErrorMessage = vi.fn();
    const showSuccessMessage = vi.fn();
    const onSortChange = vi.fn();
    const onTagSuccess = vi.fn();
    const onTargetEditClick = vi.fn();
    const onTlsCertificateDownloadClick = vi.fn();

    const sorting = {
      apps: {sortField: 'severity', sortReverse: true},
      closedcves: {sortField: 'severity', sortReverse: true},
      cves: {sortField: 'severity', sortReverse: true},
      errors: {sortField: 'error', sortReverse: true},
      hosts: {sortField: 'severity', sortReverse: true},
      os: {sortField: 'severity', sortReverse: true},
      ports: {sortField: 'severity', sortReverse: true},
      results: {sortField: 'severity', sortReverse: true},
      tlscerts: {sortField: 'dn', sortReverse: true},
    };

    const {entity} = getMockReport();

    const filters = [filterWithName];

    const gmp = {
      settings: {manualUrl, reportResultsThreshold: 10},
      user: {currentSettings, getReportComposerDefaults},
    };

    const {render, store} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    const {baseElement, getAllByTestId} = render(
      <DetailsContent
        activeTab={0}
        applicationsCounts={{all: 4, filtered: 4}}
        closedCvesCounts={{all: 2, filtered: 2}}
        cvesCounts={{all: 2, filtered: 2}}
        entity={entity}
        errorsCounts={{all: 2, filtered: 2}}
        filters={filters}
        hostsCounts={{all: 2, filtered: 2}}
        isLoading={false}
        isUpdating={false}
        operatingSystemsCounts={{all: 2, filtered: 2}}
        pageFilter={filter}
        portsCounts={{all: 2, filtered: 2}}
        resultsCounts={{all: 3, filtered: 2}}
        reportFilter={filter}
        reportId={entity.report.id}
        resetFilter={resetFilter}
        sorting={sorting}
        task={entity.report.task}
        tlsCertificatesCounts={{all: 2, filtered: 2}}
        onActivateTab={onActivateTab}
        onAddToAssetsClick={onAddToAssetsClick}
        onError={onError}
        onFilterAddLogLevelClick={onFilterAddLogLevelClick}
        onFilterDecreaseMinQoDClick={onFilterDecreaseMinQoDClick}
        onFilterChanged={onFilterChanged}
        onFilterCreated={onFilterCreated}
        onFilterEditClick={onFilterEditClick}
        onFilterRemoveSeverityClick={onFilterRemoveSeverityClick}
        onFilterResetClick={onFilterResetClick}
        onFilterRemoveClick={onFilterRemoveClick}
        onInteraction={onInteraction}
        onRemoveFromAssetsClick={onRemoveFromAssetsClick}
        onReportDownloadClick={onReportDownloadClick}
        onSortChange={onSortChange}
        onTagSuccess={onTagSuccess}
        onTargetEditClick={onTargetEditClick}
        onTlsCertificateDownloadClick={onTlsCertificateDownloadClick}
        showError={showError}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
      />,
    );

    const icons = baseElement.querySelectorAll('svg');
    const inputs = baseElement.querySelectorAll('input');
    const links = baseElement.querySelectorAll('a');
    const tableData = baseElement.querySelectorAll('td');
    const selects = getAllByTestId('select-selected-value');
    const bars = getAllByTestId('progressbar-box');

    // Toolbar Icons
    expect(icons.length).toEqual(17);

    // Powerfilter
    expect(inputs[0]).toHaveAttribute('name', 'userFilterString');
    expect(selects[0]).toHaveAttribute('title', 'Loaded filter');
    expect(selects[0]).toHaveTextContent('Loading...');

    // Header
    expect(baseElement).toHaveTextContent(
      'Report:Mon, Jun 3, 2019 1:00 PM CEST',
    );
    expect(bars[0]).toHaveAttribute('title', 'Done');
    expect(bars[0]).toHaveTextContent('Done');
    expect(baseElement).toHaveTextContent(
      'Created:Sun, Jun 2, 2019 2:00 PM CEST',
    );
    expect(baseElement).toHaveTextContent(
      'Modified:Mon, Jun 3, 2019 1:00 PM CEST',
    );
    expect(baseElement).toHaveTextContent('Owner:admin');

    // Tabs
    expect(baseElement).toHaveTextContent('Information');
    expect(baseElement).toHaveTextContent('Results(2 of 3)');
    expect(baseElement).toHaveTextContent('Hosts(2 of 2)');
    expect(baseElement).toHaveTextContent('Ports(2 of 2)');
    expect(baseElement).toHaveTextContent('Applications(4 of 4)');
    expect(baseElement).toHaveTextContent('Operating Systems(2 of 2)');
    expect(baseElement).toHaveTextContent('CVEs(2 of 2)');
    expect(baseElement).toHaveTextContent('Closed CVEs(2 of 2)');
    expect(baseElement).toHaveTextContent('TLS Certificates(2 of 2)');
    expect(baseElement).toHaveTextContent('Error Messages(2 of 2)');
    expect(baseElement).toHaveTextContent('User Tags(0)');

    // Summary
    expect(tableData[0]).toHaveTextContent('Task Name');
    expect(links[8]).toHaveAttribute('href', '/task/314');
    expect(tableData[1]).toHaveTextContent('foo');

    expect(tableData[2]).toHaveTextContent('Comment');
    expect(tableData[3]).toHaveTextContent('bar');

    expect(tableData[4]).toHaveTextContent('Scan Time');
    expect(tableData[5]).toHaveTextContent(
      'Mon, Jun 3, 2019 1:00 PM CEST - Mon, Jun 3, 2019 1:31 PM CEST',
    );

    expect(tableData[6]).toHaveTextContent('Scan Duration');
    expect(tableData[7]).toHaveTextContent('0:31 h');

    expect(tableData[8]).toHaveTextContent('Scan Status');
    expect(bars[1]).toHaveAttribute('title', 'Done');
    expect(bars[1]).toHaveTextContent('Done');

    expect(tableData[10]).toHaveTextContent('Hosts scanned');
    expect(tableData[11]).toHaveTextContent('2');

    expect(tableData[12]).toHaveTextContent('Filter');
    expect(tableData[13]).toHaveTextContent(
      'apply_overrides=0 levels=hml min_qod=70',
    );

    expect(tableData[14]).toHaveTextContent('Timezone');
    expect(tableData[15]).toHaveTextContent('UTC (UTC)');
  });

  test('should render threshold panel', () => {
    const onActivateTab = vi.fn();
    const onAddToAssetsClick = vi.fn();
    const onError = vi.fn();
    const onFilterAddLogLevelClick = vi.fn();
    const onFilterDecreaseMinQoDClick = vi.fn();
    const onFilterChanged = vi.fn();
    const onFilterCreated = vi.fn();
    const onFilterEditClick = vi.fn();
    const onFilterRemoveSeverityClick = vi.fn();
    const onFilterResetClick = vi.fn();
    const onFilterRemoveClick = vi.fn();
    const onInteraction = vi.fn();
    const onRemoveFromAssetsClick = vi.fn();
    const onReportDownloadClick = vi.fn();
    const showError = vi.fn();
    const showErrorMessage = vi.fn();
    const showSuccessMessage = vi.fn();
    const onSortChange = vi.fn();
    const onTagSuccess = vi.fn();
    const onTargetEditClick = vi.fn();
    const onTlsCertificateDownloadClick = vi.fn();

    const sorting = {
      apps: {sortField: 'severity', sortReverse: true},
      closedcves: {sortField: 'severity', sortReverse: true},
      cves: {sortField: 'severity', sortReverse: true},
      errors: {sortField: 'error', sortReverse: true},
      hosts: {sortField: 'severity', sortReverse: true},
      os: {sortField: 'severity', sortReverse: true},
      ports: {sortField: 'severity', sortReverse: true},
      results: {sortField: 'severity', sortReverse: true},
      tlscerts: {sortField: 'dn', sortReverse: true},
    };

    const {entity} = getMockReport();

    const filters = [filterWithName];

    const gmp = {
      settings: {manualUrl, reportResultsThreshold: 1},
      user: {currentSettings, getReportComposerDefaults},
    };

    const {render, store} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
      store: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    const {baseElement, getAllByTestId} = render(
      <DetailsContent
        activeTab={2}
        applicationsCounts={{all: 4, filtered: 4}}
        closedCvesCounts={{all: 2, filtered: 2}}
        cvesCounts={{all: 2, filtered: 2}}
        entity={entity}
        errorsCounts={{all: 2, filtered: 2}}
        filters={filters}
        hostsCounts={{all: 2, filtered: 2}}
        isLoading={false}
        isUpdating={false}
        operatingSystemsCounts={{all: 2, filtered: 2}}
        pageFilter={filter}
        portsCounts={{all: 2, filtered: 2}}
        reportFilter={filter}
        reportId={entity.report.id}
        resetFilter={resetFilter}
        resultsCounts={{all: 3, filtered: 2}}
        sorting={sorting}
        task={entity.report.task}
        tlsCertificatesCounts={{all: 2, filtered: 2}}
        onActivateTab={onActivateTab}
        onAddToAssetsClick={onAddToAssetsClick}
        onError={onError}
        onFilterAddLogLevelClick={onFilterAddLogLevelClick}
        onFilterDecreaseMinQoDClick={onFilterDecreaseMinQoDClick}
        onFilterChanged={onFilterChanged}
        onFilterCreated={onFilterCreated}
        onFilterEditClick={onFilterEditClick}
        onFilterRemoveSeverityClick={onFilterRemoveSeverityClick}
        onFilterResetClick={onFilterResetClick}
        onFilterRemoveClick={onFilterRemoveClick}
        onInteraction={onInteraction}
        onRemoveFromAssetsClick={onRemoveFromAssetsClick}
        onReportDownloadClick={onReportDownloadClick}
        onSortChange={onSortChange}
        onTagSuccess={onTagSuccess}
        onTargetEditClick={onTargetEditClick}
        onTlsCertificateDownloadClick={onTlsCertificateDownloadClick}
        showError={showError}
        showErrorMessage={showErrorMessage}
        showSuccessMessage={showSuccessMessage}
      />,
    );

    const icons = baseElement.querySelectorAll('svg');
    const inputs = baseElement.querySelectorAll('input');
    const selects = getAllByTestId('select-selected-value');
    const bars = getAllByTestId('progressbar-box');

    // Toolbar Icons
    expect(icons.length).toEqual(20)
    // Powerfilter
    expect(inputs[0]).toHaveAttribute('name', 'userFilterString');
    expect(selects[0]).toHaveAttribute('title', 'Loaded filter');
    expect(selects[0]).toHaveTextContent('Loading...');

    // Header
    expect(baseElement).toHaveTextContent(
      'Report:Mon, Jun 3, 2019 1:00 PM CEST',
    );
    expect(bars[0]).toHaveAttribute('title', 'Done');
    expect(bars[0]).toHaveTextContent('Done');
    expect(baseElement).toHaveTextContent(
      'Created:Sun, Jun 2, 2019 2:00 PM CEST',
    );
    expect(baseElement).toHaveTextContent(
      'Modified:Mon, Jun 3, 2019 1:00 PM CEST',
    );
    expect(baseElement).toHaveTextContent('Owner:admin');

    // Tabs
    expect(baseElement).toHaveTextContent('Information');
    expect(baseElement).toHaveTextContent('Results(2 of 3)');
    expect(baseElement).toHaveTextContent('Hosts(2 of 2)');
    expect(baseElement).toHaveTextContent('Ports(2 of 2)');
    expect(baseElement).toHaveTextContent('Applications(4 of 4)');
    expect(baseElement).toHaveTextContent('Operating Systems(2 of 2)');
    expect(baseElement).toHaveTextContent('CVEs(2 of 2)');
    expect(baseElement).toHaveTextContent('Closed CVEs(2 of 2)');
    expect(baseElement).toHaveTextContent('TLS Certificates(2 of 2)');
    expect(baseElement).toHaveTextContent('Error Messages(2 of 2)');
    expect(baseElement).toHaveTextContent('User Tags(0)');

    // Should include
    expect(baseElement).toHaveTextContent(
      "The Hosts cannot be displayed in order to maintain the performance within the browser's capabilities.",
    );
    expect(baseElement).toHaveTextContent(
      'Please decrease the number of results below the threshold of 1 by applying a more refined filter.',
    );
    expect(baseElement).toHaveTextContent(
      'Results with the severity "Low" are currently included.',
    );
    expect(baseElement).toHaveTextContent(
      'Filter out results with the severity "Low".',
    );

    expect(baseElement).toHaveTextContent(
      'Results with the severity "Medium" are currently included.',
    );
    expect(baseElement).toHaveTextContent(
      'Filter out results with the severity "Medium".',
    );

    expect(baseElement).toHaveTextContent(
      'Your filter settings may be too unrefined.',
    );
    expect(baseElement).toHaveTextContent(
      'Adjust and update your filter settings.',
    );
    expect(baseElement).toHaveTextContent(
      '(Applied filter: apply_overrides=0 levels=hml min_qod=70)',
    );

    // Should not Include
    expect(baseElement).not.toHaveTextContent('IP-Adress');
    expect(baseElement).not.toHaveTextContent('Hostname');
    expect(baseElement).not.toHaveTextContent('Apps');
    expect(baseElement).not.toHaveTextContent('Distance');
  });
});
