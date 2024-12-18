/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import React from 'react';
import {connect} from 'react-redux';
import {useSearchParams} from 'react-router-dom';
import withDownload from 'web/components/form/withDownload';
import Reload from 'web/components/loading/reload';
import withDialogNotification from 'web/components/notification/withDialogNotifiaction';
import SubscriptionProvider from 'web/components/provider/subscriptionprovider';
import FilterProvider from 'web/entities/filterprovider';
import {pageFilter} from 'web/store/pages/actions';
import {renewSessionTimeout} from 'web/store/usersettings/actions';
import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import withGmp from 'web/utils/withGmp';

import EntitiesContainer from './container';

const noop = () => {};

const withEntitiesContainer =
  (
    gmpname,
    {
      entitiesSelector,
      loadEntities: loadEntitiesFunc,
      reloadInterval = noop,
      fallbackFilter,
    },
  ) =>
  Component => {
    let EntitiesContainerWrapper = ({
      children,
      filter,
      loadEntities,
      notify,
      ...props
    }) => (
      <Reload
        name={gmpname}
        reload={(newFilter = filter) => loadEntities(newFilter)}
        reloadInterval={() => reloadInterval(props)}
      >
        {({reload}) => (
          <EntitiesContainer
            {...props}
            filter={filter}
            gmpname={gmpname}
            notify={notify}
            reload={reload}
          >
            {pageProps => <Component {...pageProps} />}
          </EntitiesContainer>
        )}
      </Reload>
    );

    EntitiesContainerWrapper.propTypes = {
      filter: PropTypes.filter,
      loadEntities: PropTypes.func.isRequired,
      notify: PropTypes.func.isRequired,
    };

    const mapStateToProps = (state, {filter}) => {
      const eSelector = entitiesSelector(state);
      const entities = eSelector.getEntities(filter);
      return {
        entities,
        entitiesCounts: eSelector.getEntitiesCounts(filter),
        entitiesError: eSelector.getEntitiesError(filter),
        filter,
        isLoading: eSelector.isLoadingEntities(filter),
        loadedFilter: eSelector.getLoadedFilter(filter),
      };
    };

    const mapDispatchToProps = (dispatch, {gmp}) => ({
      loadEntities: filter => dispatch(loadEntitiesFunc(gmp)(filter)),
      updateFilter: filter => dispatch(pageFilter(gmpname, filter)),
      onInteraction: () => dispatch(renewSessionTimeout(gmp)()),
    });

    EntitiesContainerWrapper = compose(
      withDialogNotification,
      withDownload,
      withGmp,
      connect(mapStateToProps, mapDispatchToProps),
    )(EntitiesContainerWrapper);

    return props => {
      const [searchParams] = useSearchParams();
      return (
        <SubscriptionProvider>
          {({notify}) => (
            <FilterProvider
              fallbackFilter={fallbackFilter}
              gmpname={gmpname}
              locationQuery={searchParams.toString()}
            >
              {({filter}) => (
                <EntitiesContainerWrapper
                  {...props}
                  filter={filter}
                  notify={notify}
                />
              )}
            </FilterProvider>
          )}
        </SubscriptionProvider>
      );
    };
  };

export default withEntitiesContainer;
