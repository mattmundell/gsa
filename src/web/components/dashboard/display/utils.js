/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {scaleOrdinal, scaleLinear} from 'd3-scale';
import {_l} from 'gmp/locale/lang';
import {COMPLIANCE_STATES} from 'gmp/models/auditreport';
import {parseInt} from 'gmp/parser';
import {
  ERROR,
  DEBUG,
  FALSE_POSITIVE,
  LOG,
  LOW,
  MEDIUM,
  HIGH,
  NA,
  CRITICAL,
} from 'web/utils/severity';
import Theme from 'web/utils/Theme';

/**
 * Calculates the total count from an array of groups.
 *
 * @param {Array} groups - An array of group objects, each containing a `count` property.
 * @returns {number} The total count of all groups. Returns 0 if the array is empty.
 */
export const totalCount = (groups = []) => {
  if (groups.length === 0) {
    return 0;
  }
  return groups
    .map(group => parseInt(group.count))
    .reduce((prev, cur) => prev + cur);
};

/**
 * Calculates the percentage of a count relative to a sum.
 *
 * @param {number|string} count - The count value to be converted to a percentage.
 * @param {number} sum - The total sum value.
 * @returns {string} The percentage value as a string with one decimal place.
 */
export const percent = (count, sum) =>
  ((parseInt(count) / sum) * 100).toFixed(1);

/**
 * Generates a random RGB color code.
 *
 * @returns {string} A random hex color code in the format '#RRGGBB'.
 */
export const randomColor = () => {
  const color = Math.floor(Math.random() * 0xffffff).toString(16);
  return '#' + color.padStart(6, '0');
};

export const activeDaysColorScale = scaleOrdinal()
  .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .range([
    '#01558e',
    '#97b5d1',
    '#8fbfa5',
    '#7fb290',
    '#70a47c',
    '#609769',
    '#508a55',
    '#407d42',
    '#2f712f',
    '#1b641b',
  ]);

export const riskFactorColorScale = scaleOrdinal()
  .domain([ERROR, DEBUG, FALSE_POSITIVE, NA, LOG, LOW, MEDIUM, HIGH, CRITICAL])
  .range([
    '#800000',
    '#008080',
    '#808080',
    'silver',
    Theme.severityClassLog,
    Theme.severityClassLow,
    Theme.severityClassMedium,
    Theme.severityClassHigh,
    Theme.severityClassCritical,
  ]);

export const vulnsByHostsColorScale = scaleLinear()
  .domain([0, 0.05, 0.25, 0.5, 0.75, 0.95, 1.0])
  .range([
    '#008644',
    '#55B200',
    '#94D800',
    '#E6E600',
    '#EDBA00',
    '#EC6E00',
    '#D63900',
  ]);

export const QOD_TYPES = {
  '': _l('None'),
  general_note: _l('General note'),
  executable_version: _l('Executable version'),
  package: _l('Package check'),
  package_unreliable: _l('Unreliable package check'),
  registry: _l('Registry check'),
  remote_active: _l('Remote active'),
  remote_analysis: _l('Remote analysis'),
  remote_app: _l('Remote app'),
  remote_banner: _l('Remote banner'),
  remote_probe: _l('Remote probe'),
  remote_banner_unreliable: _l('Unreliable rem. banner'),
  executable_version_unreliable: _l('Unreliable exec. version'),
  remote_vul: _l('Remote vulnerability'),
  exploit: _l('Exploit'),
};

export const qodColorScale = scaleOrdinal()
  .domain([1, 30, 50, 70, 75, 80, 95, 97, 98, 99, 100])
  .range([
    '#011f4b',
    '#023061',
    '#024277',
    '#01558e',
    '#3c70a5',
    '#6c92bb',
    '#97b5d1',
    '#a9c9ce',
    '#87bc99',
    '#61ae65',
    '#2ca02c',
  ]);

export const qodTypeColorScale = scaleOrdinal()
  .domain(Object.keys(QOD_TYPES))
  .range([
    'silver', // ''
    '#555555', // general_note
    '#011f4b', // executable_version
    '#596d8a', // package
    '#d6d624', // package_unreliable
    '#a9c9ce', // registry
    '#98df8a', // remote_active
    '#80c674', // remote_analysis
    '#69af5f', // remote_app
    '#53984a', // remote_banner
    '#3c8136', // remote_probe
    '#e6e600', // remote_banner_unreliable
    '#ffff99', // executable_version_unreliable
    '#ff9933', // remote_vul
    '#d62728', // Exploit
  ]);

export const SEC_INFO_TYPES = {
  cert_bund_adv: _l('CERT-Bund Advisories'),
  cpe: _l('CPEs'),
  cve: _l('CVEs'),
  dfn_cert_adv: _l('DFN-CERT Advisories'),
  nvt: _l('NVTs'),
};

export const secInfoTypeColorScale = scaleOrdinal()
  .domain(Object.keys(SEC_INFO_TYPES))
  .range([
    '#011f4b', // CERT-Bund Advisories
    '#596d8a', // CPEs
    '#a9c9ce', // CVEs
    '#98df8a', // DFN-CERT Advisories
    '#80c674', // Nvts
  ]);

export const complianceColorScale = scaleOrdinal()
  .domain(Object.keys(COMPLIANCE_STATES))
  .range(['#4cb045', '#D80000', 'orange', 'silver']);
