/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
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

import {isDefined} from '../../utils/identity';
import {isEmpty} from '../../utils/string';

import {parseInt} from '../../parser.js';

const convertBooleanInt = (keyword, value, relation) => ({
  keyword,
  value:
  parseInt(value) >= 1 ? 1 : 0,
  relation,
});

const convertInt = (keyword, value, relation) => ({
  keyword,
  value: parseInt(value),
  relation,
});

const convertNoRelation = (keyword, value, relation) => ({
  keyword,
  value,
});

const convertNoRelationAndKeyword = (keyword, value, relation) => ({value});

const KEYWORD_CONVERTERS = {
  apply_overrides: convertBooleanInt,
  autofp: convertInt,
  first: convertInt,
  min_qod: convertInt,
  notes: convertBooleanInt,
  overrides: convertBooleanInt,
  result_hosts_only: convertBooleanInt,
  rows: convertInt,
};

const VALUE_CONVERTERS = {
  and: convertNoRelationAndKeyword,
  or: convertNoRelationAndKeyword,
  not: convertNoRelationAndKeyword,
  re: convertNoRelation,
  regexp: convertNoRelation,
  '': convertNoRelation,
};

const convert = (keyword, value, relation) => {
  let converter = KEYWORD_CONVERTERS[keyword];
  if (isDefined(converter)) {
    return converter(keyword, value, relation);
  }

  converter = VALUE_CONVERTERS[value];
  if (isDefined(converter)) {
    return converter(keyword, value, relation);
  }

  if (isEmpty(keyword)) {
    return {value, relation};
  }

  return {
    value,
    keyword,
    relation,
  };
};

export default convert;

// vim: set ts=2 sw=2 tw=80:
