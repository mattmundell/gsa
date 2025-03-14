/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';
import Filter from 'gmp/models/filter';
import TaskTrendGroup from 'web/components/powerfilter/TaskTrendGroup';
import {
  clickElement,
  getSelectElement,
  getSelectItemElements,
  openSelectElement,
} from 'web/components/testing';
import {render} from 'web/utils/Testing';

describe('Task Trend Selector Tests', () => {
  test('should render', () => {
    const onChange = testing.fn();
    const filter = Filter.fromString('trend=down');
    const {element} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    expect(element).toBeVisible();
  });

  test('should return items', async () => {
    const onChange = testing.fn();
    const filter = Filter.fromString('trend=down');

    const {queryByRole} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    let domItems = getSelectItemElements();

    expect(queryByRole('option')).not.toBeInTheDocument();

    await openSelectElement();

    domItems = getSelectItemElements();

    expect(domItems.length).toEqual(5);
    expect(domItems[0]).toHaveTextContent('Severity increased');
    expect(domItems[1]).toHaveTextContent('Severity decreased');
    expect(domItems[2]).toHaveTextContent('Vulnerability count increased');
  });

  test('should parse filter', () => {
    const onChange = testing.fn();
    const filter = Filter.fromString('trend=same');

    render(<TaskTrendGroup filter={filter} onChange={onChange} />);

    const select = getSelectElement();
    expect(select).toHaveValue('Vulnerabilities did not change');
  });

  test('should call onChange handler', async () => {
    const onChange = testing.fn();
    const filter = Filter.fromString('trend=down');

    render(<TaskTrendGroup filter={filter} onChange={onChange} />);

    await openSelectElement();

    const domItems = getSelectItemElements();
    await clickElement(domItems[0]);

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('up', 'trend');
  });

  test('should change value', async () => {
    const onChange = testing.fn();
    const filter = Filter.fromString('trend=down');

    render(<TaskTrendGroup filter={filter} trend="up" onChange={onChange} />);

    const select = getSelectElement();
    expect(select).toHaveValue('Severity increased');

    await openSelectElement();

    const domItems = getSelectItemElements();
    await clickElement(domItems[2]);

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('more', 'trend');
  });
});
