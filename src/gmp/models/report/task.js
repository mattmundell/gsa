/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Model, {parseModelFromElement} from '../../model';
import {parseProgressElement} from '../../parser';
import {isDefined} from '../../utils/identity';
import {isEmpty} from '../../utils/string';

/*
 * Use own task model for reports to avoid cyclic dependencies
 */

class ReportTask extends Model {
  static entityType = 'task';

  static parseElement(element) {
    const copy = super.parseElement(element);

    const {target} = element;
    if (isDefined(target) && !isEmpty(target._id)) {
      copy.target = parseModelFromElement(target, 'target');
    } else {
      delete copy.target;
    }

    copy.progress = parseProgressElement(element.progress);

    return copy;
  }

  isContainer() {
    return !isDefined(this.target);
  }
}

export default ReportTask;
