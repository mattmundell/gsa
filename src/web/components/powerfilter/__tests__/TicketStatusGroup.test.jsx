/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';
import Filter from 'gmp/models/filter';
import TicketStatusGroup from 'web/components/powerfilter/TicketStatusGroup';
import {
  clickElement,
  getElementOrReturnDocument,
  getSelectElement,
  getSelectItemElements,
  openSelectElement,
} from 'web/components/testing';
import {render} from 'web/utils/Testing';

const getTitle = element => {
  element = getElementOrReturnDocument(element);
  return element.querySelector('.mantine-Text-root');
};

describe('TicketStatusGroup tests', () => {
  test('should render', () => {
    const filter = Filter.fromString('status=Closed');
    const handleChange = testing.fn();

    const {element} = render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    expect(element).toBeVisible();
  });

  test('should render value from filter and change it', async () => {
    const filter = Filter.fromString('status=Closed');
    const handleChange = testing.fn();

    render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    const select = getSelectElement();
    expect(select).toHaveValue('Closed');

    await openSelectElement();

    const domItems = getSelectItemElements();
    await clickElement(domItems[2]);

    expect(handleChange).toBeCalled();
    expect(handleChange).toBeCalledWith('"Fix Verified"', 'status');
  });

  test('should process title', () => {
    const filter = Filter.fromString('status=Open');
    const handleChange = testing.fn();

    render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    expect(getTitle()).toHaveTextContent('Ticket Status');
  });
});
