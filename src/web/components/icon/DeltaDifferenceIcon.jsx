/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Icon from 'web/components/icon/svg/delta_second.svg';
import withSvgIcon from 'web/components/icon/withSvgIcon';

const DeltaDifferenceIconComponent = withSvgIcon()(Icon);

const DeltaDifferenceIcon = props => (
  <DeltaDifferenceIconComponent
    {...props}
    data-testid="delta-difference-icon"
  />
);

export default DeltaDifferenceIcon;
