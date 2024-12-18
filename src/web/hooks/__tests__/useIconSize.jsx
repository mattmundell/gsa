/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect} from '@gsa/testing';
import useIconSize, {
  ICON_SIZE_LARGE_PIXELS,
  ICON_SIZE_MEDIUM_PIXELS,
  ICON_SIZE_SMALL_PIXELS,
  ICON_SIZE_TINY_PIXELS,
} from 'web/hooks/useIconSize';
import {renderHook} from 'web/utils/testing';

describe('useIconSize', () => {
  test.each([
    [undefined, ICON_SIZE_SMALL_PIXELS, ICON_SIZE_SMALL_PIXELS],
    ['medium', ICON_SIZE_MEDIUM_PIXELS, ICON_SIZE_MEDIUM_PIXELS],
    ['tiny', ICON_SIZE_TINY_PIXELS, ICON_SIZE_TINY_PIXELS],
    ['large', ICON_SIZE_LARGE_PIXELS, ICON_SIZE_LARGE_PIXELS],
    [['100px', '200px'], '100px', '200px'],
  ])(
    'should return correct size when %s is specified',
    (input, expectedWidth, expectedHeight) => {
      const {result} = renderHook(() => useIconSize(input));
      expect(result.current).toEqual({
        height: expectedHeight,
        width: expectedWidth,
      });
    },
  );
});
