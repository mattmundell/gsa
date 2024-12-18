/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import _ from 'gmp/locale';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import DetailsIcon from 'web/components/icon/detailsicon';
import IconDivider from 'web/components/layout/icondivider';
import DetailsLink from 'web/components/link/detailslink';
import EntityBox from 'web/entity/box';
import PropTypes from 'web/utils/proptypes';
import {
  LOG_VALUE,
  translatedResultSeverityRiskFactor,
} from 'web/utils/severity';

const OverrideBox = ({override, detailsLink = true}) => {
  let severity;
  let newSeverity = '';
  if (!isDefined(override.severity)) {
    severity = _('Any');
  } else if (override.severity > LOG_VALUE) {
    severity = _('Severity > 0.0');
  } else {
    severity = translatedResultSeverityRiskFactor(override.severity);
  }

  if (override.newSeverity > LOG_VALUE) {
    newSeverity = override.newSeverity + ': ';
  }
  newSeverity += translatedResultSeverityRiskFactor(override.newSeverity);

  const toolbox = detailsLink ? (
    <IconDivider>
      <DetailsLink
        id={override.id}
        title={_('Override Details')}
        type="override"
      >
        <DetailsIcon />
      </DetailsLink>
    </IconDivider>
  ) : (
    undefined
  );
  return (
    <EntityBox
      end={override.endTime}
      modified={override.modificationTime}
      text={override.text}
      title={_('Override from {{- severity}} to {{- newSeverity}}', {
        severity,
        newSeverity,
      })}
      toolbox={toolbox}
    />
  );
};

OverrideBox.propTypes = {
  className: PropTypes.string,
  detailsLink: PropTypes.bool,
  override: PropTypes.model.isRequired,
};

export default OverrideBox;
