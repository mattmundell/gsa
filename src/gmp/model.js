/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Capabilities from 'gmp/capabilities/capabilities';
import {
  parseProperties as parseDefaultProperties,
  parseYesNo,
  parseDate,
  parseBoolean,
  parseText,
  setProperties,
  NO_VALUE,
  YES_VALUE,
  parseToString,
} from 'gmp/parser';
import {map} from 'gmp/utils/array';
import {isDefined} from 'gmp/utils/identity';
import {isEmpty} from 'gmp/utils/string';


export const parseModelFromElement = (element, entityType) => {
  const m = new Model(entityType);
  const props = Model.parseElement(element);
  m.setProperties(props);
  return m;
};

class Model {
  static entityType = 'unknown';

  constructor(type) {
    this.entityType = isDefined(type) ? type : this.constructor.entityType;
  }

  setProperties(properties) {
    return setProperties(properties, this);
  }

  getProperties() {
    return Object.entries(this).reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {});
  }

  static fromElement(element = {}, type) {
    const f = new this(type);
    f.setProperties(this.parseElement(element));
    return f;
  }

  static parseElement(element = {}) {
    const copy = parseDefaultProperties(element);

    if (isDefined(element.name)) {
      copy.name = parseToString(element.name);
    }

    if (isDefined(element.end_time)) {
      if (element.end_time.length > 0) {
        copy.endTime = parseDate(element.end_time);
      }
      delete copy.end_time;
    }

    if (isDefined(element.timestamp)) {
      if (element.timestamp.length > 0) {
        copy.timestamp = parseDate(element.timestamp);
      }
    }

    if (isDefined(element.permissions)) {
      // these are the permissions the current user has on the entity
      const caps = map(element.permissions.permission, perm => perm.name);
      copy.userCapabilities = new Capabilities(caps);
      delete copy.permissions;
    } else {
      copy.userCapabilities = new Capabilities();
    }

    if (isDefined(element.user_tags)) {
      copy.userTags = map(element.user_tags.tag, tag => {
        return parseModelFromElement(tag, 'tag');
      });
      delete copy.user_tags;
    } else {
      copy.userTags = [];
    }

    const yes_no_props = ['writable', 'orphan', 'active', 'trash'];

    for (const name of yes_no_props) {
      const prop = element[name];
      if (isDefined(prop)) {
        copy[name] = parseYesNo(prop);
      }
    }

    if (isDefined(element.in_use)) {
      copy.inUse = parseBoolean(element.in_use);
      delete copy.in_use;
    }

    if (isDefined(element.owner) && isEmpty(element.owner.name)) {
      delete copy.owner;
    }

    copy.summary = parseText(element.summary);

    if (isEmpty(element.summary)) {
      delete copy.summary;
    }

    copy.comment = parseText(element.comment);

    if (isEmpty(element.comment)) {
      delete copy.comment;
    }

    return copy;
  }

  isInUse() {
    return this.inUse === true;
  }

  isInTrash() {
    return this.trash === YES_VALUE;
  }

  isWritable() {
    return this.writable !== NO_VALUE;
  }

  isOrphan() {
    return this.orphan === YES_VALUE;
  }

  isActive() {
    return this.active !== NO_VALUE;
  }
}

export default Model;
