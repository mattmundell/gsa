/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import _ from 'gmp/locale';
import {duration} from 'gmp/models/date';
import {scannerTypeName} from 'gmp/models/scanner';
import {isDefined} from 'gmp/utils/identity';
import React from 'react';
import {connect} from 'react-redux';
import DateTime from 'web/components/date/datetime';
import HorizontalSep from 'web/components/layout/horizontalsep';
import Layout from 'web/components/layout/layout';
import DetailsLink from 'web/components/link/detailslink';
import TableBody from 'web/components/table/body';
import TableData from 'web/components/table/data';
import DetailsTable from 'web/components/table/detailstable';
import TableRow from 'web/components/table/row';
import DetailsBlock from 'web/entity/block';
import {compareAlerts} from 'web/pages/tasks/details';
import {
  loadEntity as loadPolicy,
  selector as policySelector,
} from 'web/store/entities/policies';
import {
  loadEntity as loadSchedule,
  selector as scheduleSelector,
} from 'web/store/entities/schedules';
import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import {renderYesNo} from 'web/utils/render';
import withGmp from 'web/utils/withGmp';

class AuditDetails extends React.Component {
  componentDidMount() {
    const {entity} = this.props;

    if (isDefined(entity.config)) {
      this.props.loadPolicy(entity.config.id);
    }
    if (isDefined(entity.schedule)) {
      this.props.loadSchedule(entity.schedule.id);
    }
  }

  render() {
    const {links = true, entity, policy, schedule} = this.props;
    const {
      alerts,
      auto_delete,
      auto_delete_data,
      average_duration,
      config,
      hosts_ordering,
      in_assets,
      last_report,
      scanner,
      schedule_periods,
      target,
      max_checks,
      max_hosts,
    } = entity;

    let dur;
    const hasDuration =
      isDefined(last_report) && isDefined(last_report.scan_start);
    if (hasDuration) {
      if (isDefined(last_report.scan_end)) {
        const diff = last_report.scan_end.diff(last_report.scan_start);
        dur = duration(diff).humanize();
      } else {
        dur = _('Not finished yet');
      }
    } else {
      dur = _('No scans yet');
    }

    const hasAvDuration = isDefined(average_duration) && average_duration > 0;
    const avDuration = hasAvDuration ? average_duration.humanize() : '';

    return (
      <Layout flex="column" grow="1">
        {isDefined(target) && (
          <DetailsBlock title={_('Target')}>
            <DetailsLink id={target.id} textOnly={!links} type="target">
              {target.name}
            </DetailsLink>
          </DetailsBlock>
        )}

        {isDefined(alerts) && (
          <DetailsBlock title={_('Alerts')}>
            <HorizontalSep>
              {alerts.sort(compareAlerts).map(alert => (
                <span key={alert.id}>
                  <DetailsLink id={alert.id} textOnly={!links} type="alert">
                    {alert.name}
                  </DetailsLink>
                </span>
              ))}
            </HorizontalSep>
          </DetailsBlock>
        )}

        {isDefined(scanner) && (
          <DetailsBlock title={_('Scanner')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('Name')}</TableData>
                  <TableData>
                    <span>
                      <DetailsLink
                        id={scanner.id}
                        textOnly={!links}
                        type="scanner"
                      >
                        {scanner.name}
                      </DetailsLink>
                    </span>
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableData>{_('Type')}</TableData>
                  <TableData>{scannerTypeName(scanner.scannerType)}</TableData>
                </TableRow>
                {isDefined(config) && (
                  <TableRow>
                    <TableData>{_('Policy')}</TableData>
                    <TableData>
                      <span>
                        <DetailsLink
                          id={config.id}
                          textOnly={!links}
                          type="policy"
                        >
                          {config.name}
                        </DetailsLink>
                      </span>
                    </TableData>
                  </TableRow>
                )}
                {isDefined(policy) && (
                  <TableRow>
                    <TableData>{_('Order for target hosts')}</TableData>
                    <TableData>{hosts_ordering}</TableData>
                  </TableRow>
                )}
                {isDefined(policy) && isDefined(max_checks) && (
                  <TableRow>
                    <TableData>
                      {_('Maximum concurrently executed NVTs per host')}
                    </TableData>
                    <TableData>{max_checks}</TableData>
                  </TableRow>
                )}
                {isDefined(policy) && isDefined(max_hosts) && (
                  <TableRow>
                    <TableData>
                      {_('Maximum concurrently scanned hosts')}
                    </TableData>
                    <TableData>{max_hosts}</TableData>
                  </TableRow>
                )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('Assets')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('Add to Assets')}</TableData>
                <TableData>{renderYesNo(in_assets)}</TableData>
              </TableRow>
            </TableBody>
          </DetailsTable>
        </DetailsBlock>

        {isDefined(schedule) && (
          <DetailsBlock title={_('Schedule')}>
            <DetailsTable>
              <TableBody>
                <TableRow>
                  <TableData>{_('Name')}</TableData>
                  <TableData>
                    <span>
                      <DetailsLink
                        id={schedule.id}
                        textOnly={!links}
                        type="schedule"
                      >
                        {schedule.name}
                      </DetailsLink>
                    </span>
                  </TableData>
                </TableRow>
                {isDefined(schedule.event) && (
                  <TableRow>
                    <TableData>{_('Next')}</TableData>
                    <TableData>
                      {isDefined(schedule.event.nextDate) ? (
                        <DateTime date={schedule.event.nextDate} />
                      ) : (
                        _('N/A')
                      )}
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </DetailsTable>
          </DetailsBlock>
        )}

        <DetailsBlock title={_('Scan')}>
          <DetailsTable>
            <TableBody>
              <TableRow>
                <TableData>{_('Duration of last Scan')}</TableData>
                <TableData>{dur}</TableData>
              </TableRow>
              {hasAvDuration && (
                <TableRow>
                  <TableData>{_('Average Scan duration')}</TableData>
                  <TableData>{avDuration}</TableData>
                </TableRow>
              )}
              {schedule_periods > 0 && (
                <TableRow>
                  <TableData>{_('Period')}</TableData>
                  <TableData>
                    {schedule_periods > 1
                      ? _('{{nr}} more times', {nr: schedule_periods})
                      : _('Once')}
                  </TableData>
                </TableRow>
              )}
              <TableRow>
                <TableData>{_('Auto delete Reports')}</TableData>
                <TableData>
                  {auto_delete === 'keep'
                    ? _(
                        'Automatically delete oldest reports but always keep ' +
                          'newest {{nr}} reports',
                        {nr: auto_delete_data},
                      )
                    : _('Do not automatically delete reports')}
                </TableData>
              </TableRow>
            </TableBody>
          </DetailsTable>
        </DetailsBlock>
      </Layout>
    );
  }
}

AuditDetails.propTypes = {
  entity: PropTypes.model.isRequired,
  gmp: PropTypes.gmp.isRequired,
  links: PropTypes.bool,
  loadPolicy: PropTypes.func.isRequired,
  loadSchedule: PropTypes.func.isRequired,
  policy: PropTypes.model,
  schedule: PropTypes.model,
};

const mapStateToProps = (rootState, {entity = {}}) => {
  const scheduleSel = scheduleSelector(rootState);
  const policySel = policySelector(rootState);
  return {
    policy: isDefined(entity.config)
      ? policySel.getEntity(entity.config.id)
      : undefined,
    schedule: isDefined(entity.schedule)
      ? scheduleSel.getEntity(entity.schedule.id)
      : undefined,
  };
};

const mapDispatchToProps = (dispatch, {gmp}) => ({
  loadPolicy: id => dispatch(loadPolicy(gmp)(id)),
  loadSchedule: id => dispatch(loadSchedule(gmp)(id)),
});

export default compose(
  withGmp,
  connect(mapStateToProps, mapDispatchToProps),
)(AuditDetails);
