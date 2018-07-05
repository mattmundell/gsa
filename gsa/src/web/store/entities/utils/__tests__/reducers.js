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
import {is_function} from 'gmp/utils/identity';

import Filter from 'gmp/models/filter';

import {createEntitiesActions, createEntityActions} from '../actions';
import {createReducer, filterIdentifier} from '../reducers';

describe('entities reducers test', () => {

  test('should create a reducer function', () => {
    const reducer = createReducer('foo');

    expect(is_function(reducer)).toBe(true);
  });

  test('Should create initial state', () => {
    const reducer = createReducer('foo');

    expect(reducer(undefined, {})).toEqual({
      byId: {},
      isLoading: {},
      errors: {},
      default: [],
    });
  });

  test('should create empty state for corresponding entityType action', () => {
    const reducer = createReducer('foo');

    expect(reducer(undefined, {entityType: 'foo'})).toEqual({
      byId: {},
      isLoading: {},
      errors: {},
      default: [],
    });
  });

  test('should not override byId accidentially', () => {
    const actions = createEntitiesActions('foo');
    const reducer = createReducer('foo');
    const filter = Filter.fromString('byId');
    const filterId = filterIdentifier(filter);
    const action = actions.success([{id: 'foo'}], filter);
    const state = {
      byId: {
        bar: {
          id: 'bar',
        },
      },
      isLoading: {
        default: true,
      },
      default: ['bar'],
    };

    expect(reducer(state, action)).toEqual({
      byId: {
        bar: {
          id: 'bar',
        },
        foo: {
          id: 'foo',
        },
      },
      errors: {},
      isLoading: {
        default: true,
        [filterId]: false,
      },
      default: ['bar'],
      [filterId]: ['foo'],
    });
  });

  test('should not override default accidentially', () => {
    const actions = createEntitiesActions('foo');
    const reducer = createReducer('foo');
    const filter = Filter.fromString('default');
    const filterId = filterIdentifier(filter);
    const action = actions.success([{id: 'foo'}], filter);
    const state = {
      byId: {
        bar: {
          id: 'bar',
        },
      },
      isLoading: {
        default: true,
      },
      default: ['bar'],
    };

    expect(reducer(state, action)).toEqual({
      byId: {
        bar: {
          id: 'bar',
        },
        foo: {
          id: 'foo',
        },
      },
      errors: {},
      isLoading: {
        default: true,
        [filterId]: false,
      },
      default: ['bar'],
      [filterId]: ['foo'],
    });
  });

  describe('reducing entities loading request actions', () => {

    test('should set isLoading with default filter', () => {
      const actions = createEntitiesActions('foo');
      const action = actions.request();
      const reducer = createReducer('foo');

      expect(reducer(undefined, action)).toEqual({
        byId: {},
        isLoading: {
          default: true,
        },
        errors: {},
        default: [],
      });
    });

    test('should set isLoading for filter', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const filter = Filter.fromString('name=foo');
      const filterId = filterIdentifier(filter);
      const action = actions.request(filter);

      expect(reducer(undefined, action)).toEqual({
        byId: {},
        isLoading: {
          [filterId]: true,
        },
        errors: {},
        default: [],
        [filterId]: [],
      });
    });

    test('should set isLoading and not override existing state', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const filter = Filter.fromString('name=foo');
      const filterId = filterIdentifier(filter);
      const otherFilter = Filter.fromString('name=bar');
      const otherFilterId = filterIdentifier(otherFilter);
      const action = actions.request(filter);
      const state = {
        isLoading: {
          [otherFilterId]: false,
        },
        [otherFilterId]: [],
      };

      expect(reducer(state, action)).toEqual({
        byId: {},
        errors: {},
        isLoading: {
          [otherFilterId]: false,
          [filterId]: true,
        },
        [otherFilterId]: [],
        [filterId]: [],
      });
    });

    test('should set isLoading and not override other properties', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const filter = Filter.fromString('name=foo');
      const filterId = filterIdentifier(filter);
      const action = actions.request(filter);
      const state = {
        errors: {
          [filterId]: 'An Error',
        },
        isLoading: {
          [filterId]: false,
        },
        [filterId]: ['foo', 'bar'],
      };

      expect(reducer(state, action)).toEqual({
        byId: {},
        errors: {
          [filterId]: 'An Error',
        },
        isLoading: {
          [filterId]: true,
        },
        [filterId]: ['foo', 'bar'],
      });
    });

  });

  describe('reducing entities loading success actions', () => {

    test('should set isLoading with default filter', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const action = actions.success([{id: 'foo'}, {id: 'bar'}]);

      expect(reducer(undefined, action)).toEqual({
        byId: {
          foo: {
            id: 'foo',
          },
          bar: {
            id: 'bar',
          },
        },
        errors: {},
        isLoading: {
          default: false,
        },
        default: ['foo', 'bar'],
      });
    });

    test('should reset other properties with default filter', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const action = actions.success([{id: 'foo'}, {id: 'bar'}]);
      const state = {
        errors: {
          default: 'An error',
        },
        isLoading: {
          default: true,
        },
        default: [],
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          foo: {
            id: 'foo',
          },
          bar: {
            id: 'bar',
          },
        },
        errors: {},
        isLoading: {
          default: false,
        },
        default: ['foo', 'bar'],
      });
    });

    test('should not override other filters', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const filter = Filter.fromString('name=bar');
      const filterId = filterIdentifier(filter);
      const otherFilter = Filter.fromString('name=foo');
      const otherFilterId = filterIdentifier(otherFilter);
      const action = actions.success([{id: 'foo'}, {id: 'bar'}], filter);
      const state = {
        errors: {
          [otherFilterId]: 'An error',
        },
        isLoading: {
          [otherFilterId]: true,
        },
        [otherFilterId]: ['lorem', 'ipsum'],
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          foo: {
            id: 'foo',
          },
          bar: {
            id: 'bar',
          },
        },
        errors: {
          [otherFilterId]: 'An error',
        },
        isLoading: {
          [otherFilterId]: true,
          [filterId]: false,
        },
        [otherFilterId]: ['lorem', 'ipsum'],
        [filterId]: ['foo', 'bar'],
      });
    });

  });

  describe('reducing entities loading error actions', () => {

    test('should set isLoading and error with default filter', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const action = actions.error('An error');

      expect(reducer(undefined, action)).toEqual({
        byId: {},
        errors: {
          default: 'An error',
        },
        isLoading: {
          default: false,
        },
        default: [],
      });
    });

    test('should reset isLoading and error with default filter', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const action = actions.error('An error');
      const state = {
        errors: {
          default: 'Another error',
        },
        isLoading: {
          default: true,
        },
        default: ['foo', 'bar'],
      };

      expect(reducer(state, action)).toEqual({
        byId: {},
        errors: {
          default: 'An error',
        },
        isLoading: {
          default: false,
        },
        default: ['foo', 'bar'],
      });
    });

    test('should not override other filters', () => {
      const actions = createEntitiesActions('foo');
      const reducer = createReducer('foo');
      const filter = Filter.fromString('name=bar');
      const filterId = filterIdentifier(filter);
      const otherFilter = Filter.fromString('name=foo');
      const otherFilterId = filterIdentifier(otherFilter);
      const action = actions.error('An error', filter);
      const state = {
        byId: {
          lorem: {
            id: 'lorem',
          },
          ipsum: {
            id: 'ipsum',
          },
        },
        errors: {
          [otherFilterId]: 'Another error',
        },
        isLoading: {
          [otherFilterId]: true,
        },
        [otherFilterId]: ['lorem', 'ipsum'],
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          lorem: {
            id: 'lorem',
          },
          ipsum: {
            id: 'ipsum',
          },
        },
        errors: {
          [otherFilterId]: 'Another error',
          [filterId]: 'An error',
        },
        isLoading: {
          [otherFilterId]: true,
          [filterId]: false,
        },
        [otherFilterId]: ['lorem', 'ipsum'],
        [filterId]: [],
      });
    });

  });

  describe('reducing entity loading requests', () => {

    test('should set isLoading', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.request(id);
      const reducer = createReducer('foo');

      expect(reducer(undefined, action)).toEqual({
        byId: {},
        isLoading: {
          [id]: true,
        },
        errors: {},
        default: [],
      });
    });

    test('should set isLoading and not override other state', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.request(id);
      const reducer = createReducer('foo');
      const state = {
        byId: {
          [id]: {
            foo: 'bar',
          },
          a3: {
            lorem: 'ipsum',
          },
        },
        isLoading: {
          a2: true,
          a3: false,
        },
        errors: {
          a1: 'An error',
          a2: 'Another error',
        },
        default: ['a2'],
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          [id]: {
            foo: 'bar',
          },
          a3: {
            lorem: 'ipsum',
          },
        },
        isLoading: {
          a2: true,
          a3: false,
          [id]: true,
        },
        errors: {
          a1: 'An error',
          a2: 'Another error',
        },
        default: ['a2'],
      });
    });

  });

  describe('reducing entity loading success', () => {

    test('should reduce success action', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const data = {
        id: 'bar',
        foo: 'bar',
      };
      const action = actions.success(id, data);
      const reducer = createReducer('foo');

      expect(reducer(undefined, action)).toEqual({
        byId: {
          [id]: {
            id: 'bar',
            foo: 'bar',
          },
        },
        default: [],
        errors: {},
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should reset isLoading', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const data = {
        id: 'bar',
        foo: 'bar',
      };
      const action = actions.success(id, data);
      const reducer = createReducer('foo');
      const state = {
        isLoading: {
          [id]: true,
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          [id]: {
            id: 'bar',
            foo: 'bar',
          },
        },
        default: [],
        errors: {},
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should reset error', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const data = {
        id: 'bar',
        foo: 'bar',
      };
      const action = actions.success(id, data);
      const reducer = createReducer('foo');
      const state = {
        errors: {
          [id]: 'An error',
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          [id]: {
            id: 'bar',
            foo: 'bar',
          },
        },
        default: [],
        errors: {},
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should override previous data', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const data = {
        id: 'bar',
        foo: 'bar',
      };
      const action = actions.success(id, data);
      const reducer = createReducer('foo');
      const state = {
        byId: {
          [id]: {
            id: 'baz',
            old: 'mydata',
          },
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          [id]: {
            id: 'bar',
            foo: 'bar',
          },
        },
        default: [],
        errors: {},
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should not override other state', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const data = {
        id: 'bar',
        foo: 'bar',
      };
      const action = actions.success(id, data);
      const reducer = createReducer('foo');
      const state = {
        byId: {
          baz: {
            id: 'baz',
            old: 'mydata',
          },
        },
        errors: {
          baz: 'An error',
        },
        isLoading: {
          bar: true,
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          [id]: {
            id: 'bar',
            foo: 'bar',
          },
          baz: {
            id: 'baz',
            old: 'mydata',
          },
        },
        default: [],
        errors: {
          baz: 'An error',
        },
        isLoading: {
          [id]: false,
          bar: true,
        },
      });
    });

  });

  describe('reducing entity loading error', () => {

    test('should reduce error action', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.error(id, 'An error');
      const reducer = createReducer('foo');

      expect(reducer(undefined, action)).toEqual({
        byId: {},
        default: [],
        errors: {
          [id]: 'An error',
        },
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should reset isLoading', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.error(id, 'An error');
      const reducer = createReducer('foo');
      const state = {
        isLoading: {
          [id]: true,
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {},
        default: [],
        errors: {
          [id]: 'An error',
        },
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should override previous error', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.error(id, 'An error');
      const reducer = createReducer('foo');
      const state = {
        errors: {
          [id]: 'An old error',
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {},
        default: [],
        errors: {
          [id]: 'An error',
        },
        isLoading: {
          [id]: false,
        },
      });
    });

    test('should not override other state', () => {
      const id = 'a1';
      const actions = createEntityActions('foo');
      const action = actions.error(id, 'An error');
      const reducer = createReducer('foo');
      const state = {
        byId: {
          baz: {
            id: 'baz',
            old: 'mydata',
          },
        },
        errors: {
          baz: 'Another error',
        },
        isLoading: {
          bar: true,
        },
      };

      expect(reducer(state, action)).toEqual({
        byId: {
          baz: {
            id: 'baz',
            old: 'mydata',
          },
        },
        default: [],
        errors: {
          baz: 'Another error',
          [id]: 'An error',
        },
        isLoading: {
          [id]: false,
          bar: true,
        },
      });

    });

  });

});

// vim: set ts=2 sw=2 tw=80:
