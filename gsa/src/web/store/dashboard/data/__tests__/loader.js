/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
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
import Filter from 'gmp/models/filter';

import {loadFunc} from '../loader';
import {
  DASHBOARD_DATA_LOADING_REQUEST,
  DASHBOARD_DATA_LOADING_SUCCESS,
  DASHBOARD_DATA_LOADING_ERROR,
} from '../actions';
import {filterIdentifier} from 'web/store/utils';

const createState = state => ({
  dashboardData: {
    ...state,
  },
});

describe('loadFunc tests', () => {

  test('should request dashboard data successfully', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const data = {
      foo: 'bar',
    };
    const func = jest.fn().mockResolvedValue(data);

    const id = 'a1';
    const filter = Filter.fromString('foo=bar');
    const props = {
      filter,
    };

    return loadFunc(func, id)(props)(dispatch, getState).then(() => {
      expect(getState).toHaveBeenCalled();
      expect(func).toHaveBeenCalledWith(props);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: DASHBOARD_DATA_LOADING_REQUEST,
        id,
        filter,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: DASHBOARD_DATA_LOADING_SUCCESS,
        id,
        filter,
        data,
      });
    });
  });

  test('should not load if data is already loading', () => {
    const id = 'a1';
    const filter = Filter.fromString('foo=bar');
    const filterString = filterIdentifier(filter);
    const state = createState({
      [id]: {
        [filterString]: {
          isLoading: true,
        },
      },
    });
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue(state);
    const data = {
      foo: 'bar',
    };
    const func = jest.fn().mockResolvedValue(data);

    const props = {
      filter,
    };

    return loadFunc(func, id)(props)(dispatch, getState).then(() => {
      expect(getState).toHaveBeenCalled();
      expect(func).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  test('should fail loading dashboard data', () => {
    const id = 'a1';
    const filter = Filter.fromString('foo=bar');
    const dispatch = jest.fn();
    const getState = jest.fn();
    const func = jest.fn().mockRejectedValue('An error');

    const props = {
      filter,
    };

    return loadFunc(func, id)(props)(dispatch, getState).then(() => {
      expect(getState).toHaveBeenCalled();
      expect(func).toHaveBeenCalledWith(props);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: DASHBOARD_DATA_LOADING_REQUEST,
        id,
        filter,
      });
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: DASHBOARD_DATA_LOADING_ERROR,
        id,
        filter,
        error: 'An error',
      });
    });
  });

});

// vim: set ts=2 sw=2 tw=80:
