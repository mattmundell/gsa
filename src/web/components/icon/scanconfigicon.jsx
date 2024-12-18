/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Icon from './svg/config.svg';
import withSvgIcon from './withSvgIcon';

const ScanConfigIconComponent = withSvgIcon()(Icon);

const ScanConfigIcon = props => (
  <ScanConfigIconComponent {...props} data-testid="scan-config-icon" />
);

export default ScanConfigIcon;
