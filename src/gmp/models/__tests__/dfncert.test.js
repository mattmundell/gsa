/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect} from '@gsa/testing';
import DfnCertAdv from 'gmp/models/dfncert';
import Info from 'gmp/models/info';
import {testModel} from 'gmp/models/testing';

testModel(DfnCertAdv, 'dfncert');

describe('DfnCertAdv model tests', () => {
  test('should be instance of Info', () => {
    const dfnCertAdv = DfnCertAdv.fromElement({});

    expect(dfnCertAdv).toBeInstanceOf(Info);
  });

  test('should parse severity correctly', () => {
    const dfnCertAdv = DfnCertAdv.fromElement({severity: '5.0'});
    const dfnCertAdv2 = DfnCertAdv.fromElement({severity: '10.0'});

    expect(dfnCertAdv.severity).toEqual(5.0);
    expect(dfnCertAdv2.severity).toEqual(10);
  });

  test('should parse advisory links', () => {
    const elem = {
      raw_data: {
        entry: {
          link: [
            {
              _rel: 'alternate',
              _href: 'prot://url',
            },
            {
              _href: 'prot://url2',
            },
            {
              _href: 'prot://url3',
            },
          ],
        },
      },
    };
    const dfnCertAdv = DfnCertAdv.fromElement(elem);

    expect(dfnCertAdv.advisoryLink).toEqual('prot://url');
    expect(dfnCertAdv.additionalLinks).toEqual(['prot://url2', 'prot://url3']);
  });

  test('should parse summary', () => {
    const elem = {
      raw_data: {
        entry: {
          summary: {
            __text: 'foo',
          },
        },
      },
    };
    const dfnCertAdv = DfnCertAdv.fromElement(elem);

    expect(dfnCertAdv.summary).toEqual('foo');
  });

  test('should parse CVEs', () => {
    const elem = {
      raw_data: {
        entry: {
          cve: ['lorem', 'ipsum', 'dolor'],
        },
      },
    };
    const dfnCertAdv = DfnCertAdv.fromElement(elem);

    expect(dfnCertAdv.cves).toEqual(['lorem', 'ipsum', 'dolor']);
  });
});
