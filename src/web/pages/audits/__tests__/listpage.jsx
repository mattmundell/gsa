/* Copyright (C) 2019-2022 Greenbone AG
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
import {describe, test, expect, testing} from '@gsa/testing';

import Capabilities from 'gmp/capabilities/capabilities';
import CollectionCounts from 'gmp/collection/collectioncounts';

import Filter from 'gmp/models/filter';
import Audit, {AUDIT_STATUS} from 'gmp/models/audit';

import {setTimezone, setUsername} from 'web/store/usersettings/actions';

import {entitiesLoadingActions} from 'web/store/entities/audits';
import {loadingActions} from 'web/store/usersettings/defaults/actions';
import {defaultFilterLoadingActions} from 'web/store/usersettings/defaultfilters/actions';

import {rendererWith, fireEvent, wait} from 'web/utils/testing';

import AuditPage, {ToolBarIcons} from '../listpage';
import {
  clickElement,
  getActionItems,
  getBulkActionItems,
  getTableBody,
} from 'web/components/testing';

const lastReport = {
  report: {
    _id: '1234',
    timestamp: '2019-07-10T12:51:27Z',
    compliance_count: {yes: 4, no: 3, incomplete: 1},
  },
};

const audit = Audit.fromElement({
  _id: '1234',
  owner: {name: 'admin'},
  name: 'foo',
  comment: 'bar',
  status: AUDIT_STATUS.done,
  alterable: '0',
  last_report: lastReport,
  permissions: {permission: [{name: 'everything'}]},
  target: {_id: 'id1', name: 'target1'},
});

const caps = new Capabilities(['everything']);
const wrongCaps = new Capabilities(['get_config']);

const reloadInterval = 1;
const manualUrl = 'test/';

const currentSettings = testing.fn().mockResolvedValue({
  foo: 'bar',
});

const getSetting = testing.fn().mockResolvedValue({
  filter: null,
});

const getFilters = testing.fn().mockReturnValue(
  Promise.resolve({
    data: [],
    meta: {
      filter: Filter.fromString(),
      counts: new CollectionCounts(),
    },
  }),
);

const getAudits = testing.fn().mockResolvedValue({
  data: [audit],
  meta: {
    filter: Filter.fromString(),
    counts: new CollectionCounts(),
  },
});

const getReportFormats = testing.fn().mockResolvedValue({
  data: [],
  meta: {
    filter: Filter.fromString(),
    counts: new CollectionCounts(),
  },
});

const renewSession = testing.fn().mockResolvedValue({
  foo: 'bar',
});

describe('AuditPage tests', () => {
  test('should render full AuditPage', async () => {
    const gmp = {
      audits: {
        get: getAudits,
      },
      filters: {
        get: getFilters,
      },
      reportformats: {
        get: getReportFormats,
      },
      reloadInterval,
      settings: {manualUrl},
      user: {currentSettings, getSetting},
    };

    const {render, store} = rendererWith({
      gmp,
      capabilities: true,
      store: true,
      router: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    const defaultSettingFilter = Filter.fromString('foo=bar');
    store.dispatch(loadingActions.success({rowsperpage: {value: '2'}}));
    store.dispatch(
      defaultFilterLoadingActions.success('audit', defaultSettingFilter),
    );

    const counts = new CollectionCounts({
      first: 1,
      all: 1,
      filtered: 1,
      length: 1,
      rows: 10,
    });
    const filter = Filter.fromString('first=1 rows=10');
    const loadedFilter = Filter.fromString('first=1 rows=10');
    store.dispatch(
      entitiesLoadingActions.success([audit], filter, loadedFilter, counts),
    );

    render(<AuditPage />);

    await wait();

    const tableBody = getTableBody();
    expect(tableBody.querySelectorAll('tr').length).toEqual(1);
  });

  test('should call commands for bulk actions', async () => {
    const deleteByFilter = testing.fn().mockResolvedValue({
      foo: 'bar',
    });

    const exportByFilter = testing.fn().mockResolvedValue({
      foo: 'bar',
    });

    const gmp = {
      audits: {
        get: getAudits,
        deleteByFilter,
        exportByFilter,
      },
      filters: {
        get: getFilters,
      },
      reportformats: {
        get: getReportFormats,
      },
      reloadInterval,
      settings: {manualUrl},
      user: {renewSession, currentSettings, getSetting: getSetting},
    };

    const {render, store} = rendererWith({
      gmp,
      capabilities: true,
      store: true,
      router: true,
    });

    store.dispatch(setTimezone('CET'));
    store.dispatch(setUsername('admin'));

    const defaultSettingFilter = Filter.fromString('foo=bar');
    store.dispatch(loadingActions.success({rowsperpage: {value: '2'}}));
    store.dispatch(
      defaultFilterLoadingActions.success('audit', defaultSettingFilter),
    );

    const counts = new CollectionCounts({
      first: 1,
      all: 1,
      filtered: 1,
      length: 1,
      rows: 10,
    });
    const filter = Filter.fromString('first=1 rows=10');
    const loadedFilter = Filter.fromString('first=1 rows=10');
    store.dispatch(
      entitiesLoadingActions.success([audit], filter, loadedFilter, counts),
    );

    render(<AuditPage />);

    await wait();

    const icons = getBulkActionItems();

    expect(deleteByFilter).not.toHaveBeenCalled();
    expect(icons[0]).toHaveAttribute('title', 'Move page contents to trashcan');
    await clickElement(icons[0]);
    expect(deleteByFilter).toHaveBeenCalled();

    expect(exportByFilter).not.toHaveBeenCalled();
    expect(icons[1]).toHaveAttribute('title', 'Export page contents');
    await clickElement(icons[1]);
    expect(exportByFilter).toHaveBeenCalled();
  });
});

describe('AuditPage ToolBarIcons test', () => {
  test('should render', () => {
    const handleAuditCreateClick = testing.fn();

    const gmp = {
      settings: {manualUrl},
    };

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    const {element} = render(
      <ToolBarIcons onAuditCreateClick={handleAuditCreateClick} />,
    );
    const icons = getActionItems();
    const links = element.querySelectorAll('a');

    expect(icons[0]).toHaveAttribute('title', 'Help: Audits');
    expect(links[0]).toHaveAttribute(
      'href',
      'test/en/compliance-and-special-scans.html#configuring-and-managing-audits',
    );
  });

  test('should call click handlers', () => {
    const handleAuditCreateClick = testing.fn();

    const gmp = {
      settings: {manualUrl},
    };

    const {render} = rendererWith({
      gmp,
      capabilities: caps,
      router: true,
    });

    render(<ToolBarIcons onAuditCreateClick={handleAuditCreateClick} />);

    const icons = getActionItems();

    fireEvent.click(icons[1]);
    expect(handleAuditCreateClick).toHaveBeenCalled();
    expect(icons[1]).toHaveAttribute('title', 'New Audit');
  });

  test('should not show icons if user does not have the right permissions', () => {
    const handleAuditCreateClick = testing.fn();

    const gmp = {
      settings: {manualUrl},
    };

    const {render} = rendererWith({
      gmp,
      capabilities: wrongCaps,
      router: true,
    });

    render(<ToolBarIcons onAuditCreateClick={handleAuditCreateClick} />);

    const icons = getActionItems();
    expect(icons.length).toBe(1);
    expect(icons[0]).toHaveAttribute('title', 'Help: Audits');
  });
});
