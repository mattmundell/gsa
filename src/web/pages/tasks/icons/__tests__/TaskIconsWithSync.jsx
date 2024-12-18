/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';
import Capabilities from 'gmp/capabilities/capabilities';
import Task, {TASK_STATUS} from 'gmp/models/task';
import TaskIconWithSync from 'web/pages/tasks/icons/TaskIconsWithSync';
import {setSyncStatus} from 'web/store/feedStatus/actions';
import {rendererWith, fireEvent} from 'web/utils/testing';
import Theme from 'web/utils/theme';

describe('TaskIconWithSync component tests', () => {
  const testCases = [
    {
      description:
        'should render StartIcon when type is "start" and not syncing',
      type: 'start',
      taskStatus: TASK_STATUS.new,
      expectedTitle: 'Start',
      expectedFill: false,
    },
    {
      description:
        'should render ResumeIcon when type is "resume" and not syncing',
      type: 'resume',
      taskStatus: TASK_STATUS.stopped,
      expectedTitle: 'Resume',
      expectedFill: false,
    },
    {
      description: 'should render syncing message when feed is syncing',
      type: 'start',
      taskStatus: TASK_STATUS.new,
      expectedTitle: 'Feed is currently syncing. Please try again later.',
      expectedFill: true,
      isSyncing: true,
    },
  ];

  test.each(testCases)(
    '$description',
    ({type, taskStatus, expectedTitle, expectedFill, isSyncing = false}) => {
      const caps = new Capabilities(['everything']);
      const task = Task.fromElement({
        status: taskStatus,
        target: {_id: '123'},
        permissions: {permission: [{name: 'everything'}]},
      });
      const clickHandler = testing.fn();

      const {render, store} = rendererWith({capabilities: caps, store: true});

      store.dispatch(setSyncStatus(isSyncing));

      const {element} = render(
        <TaskIconWithSync task={task} type={type} onClick={clickHandler} />,
      );

      if (!isSyncing) {
        expect(caps.mayOp(`${type}_task`)).toEqual(true);
        expect(task.userCapabilities.mayOp(`${type}_task`)).toEqual(true);

        fireEvent.click(element);

        expect(clickHandler).toHaveBeenCalled();
      }

      expect(element).toHaveAttribute('title', expectedTitle);
      if (expectedFill) {
        expect(element).toHaveStyleRule('color', Theme.inputBorderGray);
      } else {
        expect(element).toHaveStyleRule('color', Theme.black);
      }
    },
  );
});
