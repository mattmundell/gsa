/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {Upload as Icon} from 'lucide-react';
import IconWithStrokeWidth from 'web/components/icon/IconWithStrokeWidth';
import withSvgIcon from 'web/components/icon/withSvgIcon';

const UploadIcon = withSvgIcon()(props => (
  <IconWithStrokeWidth
    IconComponent={Icon}
    {...props}
    data-testid="upload-icon"
  />
));

export default UploadIcon;
