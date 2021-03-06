/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 * Steffen Waterkamp <steffen.waterkamp@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react';

import styled from 'styled-components';

import _ from 'gmp/locale';

import {KeyCode} from 'gmp/utils/event';
import {isDefined} from 'gmp/utils/identity';

import FormGroup from 'web/components/form/formgroup';
import PasswordField from 'web/components/form/passwordfield';
import Button from 'web/components/form/button';
import TextField from 'web/components/form/textfield';

import Img from 'web/components/img/img';

import Layout from 'web/components/layout/layout';

import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';

const Panel = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  padding-bottom: 10px;
  font-size: 9pt;
`;

const LoginPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Error = styled.p`
  color: ${Theme.warningRed};
  font-weight: bold;
  text-align: center;
  margin: 10px;
`;

const StyledImg = styled(Img)`
  display: flex;
  height: 95px;
`;

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleSubmit() {
    const {onSubmit} = this.props;

    if (!isDefined(onSubmit)) {
      return;
    }

    const {username, password} = this.state;
    onSubmit(username, password);
  }

  handleValueChange(value, name) {
    this.setState({[name]: value});
  }

  handleKeyDown(event) {
    if (event.keyCode === KeyCode.ENTER) {
      this.handleSubmit(event);
    }
  }

  render() {
    const {error} = this.props;
    const {username, password} = this.state;
    const protocol_insecure = window.location.protocol !== 'https:';
    return (
      <React.Fragment>
        {protocol_insecure &&
          <Panel>
            <Error>{_('Warning: Connection unencrypted')}</Error>
            <p>{_('The connection to this GSA is not encrypted, allowing ' +
              'anyone listening to the traffic to steal your credentials.')}</p>
            <p>{_('Please configure a TLS certificate for the HTTPS service ' +
              'or ask your administrator to do so as soon as possible.')}</p>
          </Panel>
        }

        <LoginPanel>
          <StyledImg src="login-label.png"/>
          <Layout flex="column">
            <FormGroup title={_('Username')} titleSize="4">
              <TextField
                name="username"
                placeholder={_('e.g. johndoe')}
                value={username}
                autoFocus="autofocus"
                tabIndex="1"
                onChange={this.handleValueChange}
              />
            </FormGroup>
            <FormGroup title={_('Password')} titleSize="4">
              <PasswordField
                name="password"
                grow="1"
                placeholder={_('Password')}
                value={password}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleValueChange}
              />
            </FormGroup>
            <FormGroup size="4" offset="4">
              <Button
                title={_('Login')}
                onClick={this.handleSubmit}
              />
            </FormGroup>
          </Layout>
        </LoginPanel>

        {isDefined(error) &&
          <Panel>
            <Error>{error}</Error>
          </Panel>
        }
      </React.Fragment>
    );
  }
}

LoginForm.propTypes = {
  error: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default LoginForm;

// vim: set ts=2 sw=2 tw=80:
