/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {combineReducers} from 'redux';

import dashboardData from './dashboard/data/reducers';
import dashboardSettings from './dashboard/settings/reducers';
import userSettings from './usersettings/reducers';
import pages from './pages/reducers';

import entities from './entities/reducers';
import {CLEAR_STORE} from 'web/store/actions';
import feedStatus from 'web/store/feedStatus/reducers';

const rootReducer = combineReducers({
  dashboardData,
  dashboardSettings,
  entities,
  userSettings,
  pages,
  feedStatus,
});

const clearStoreReducer = (state = {}, action) => {
  if (action.type === CLEAR_STORE) {
    state = {};
  }
  return rootReducer(state, action);
};

export default clearStoreReducer;

// vim: set ts=2 sw=2 tw=80:
