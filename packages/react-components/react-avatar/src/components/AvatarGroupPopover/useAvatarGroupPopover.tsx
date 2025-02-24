import * as React from 'react';
import { AvatarGroupContext } from '../../contexts/AvatarGroupContext';
import { defaultAvatarGroupSize } from '../AvatarGroup/useAvatarGroup';
import { resolveShorthand, useControllableState } from '@fluentui/react-utilities';
import { MoreHorizontalRegular } from '@fluentui/react-icons';
import { OnOpenChangeData, OpenPopoverEvents, Popover, PopoverSurface } from '@fluentui/react-popover';
import { useContextSelector } from '@fluentui/react-context-selector';
import type { AvatarGroupPopoverProps, AvatarGroupPopoverState } from './AvatarGroupPopover.types';
import { Tooltip } from '@fluentui/react-tooltip';

/**
 * Create the state required to render AvatarGroupPopover.
 *
 * The returned state can be modified with hooks such as useAvatarGroupPopoverStyles_unstable,
 * before being passed to renderAvatarGroupPopover_unstable.
 *
 * @param props - props from this instance of AvatarGroupPopover
 */
export const useAvatarGroupPopover_unstable = (props: AvatarGroupPopoverProps): AvatarGroupPopoverState => {
  const size = useContextSelector(AvatarGroupContext, ctx => ctx.size) ?? defaultAvatarGroupSize;
  const layout = useContextSelector(AvatarGroupContext, ctx => ctx.layout);
  const {
    indicator = size < 24 ? 'icon' : 'count',
    count = React.Children.count(props.children),
    children,
    ...restOfProps
  } = props;

  const [popoverOpen, setPopoverOpen] = useControllableState({
    state: props.open,
    defaultState: props.defaultOpen,
    initialState: false,
  });

  const handleOnPopoverChange = (e: OpenPopoverEvents, data: OnOpenChangeData) => {
    restOfProps.onOpenChange?.(e, data);
    setPopoverOpen(data.open);
  };

  let triggerButtonChildren;
  if (layout === 'pie') {
    triggerButtonChildren = null;
  } else if (indicator === 'icon') {
    triggerButtonChildren = <MoreHorizontalRegular />;
  } else {
    triggerButtonChildren = count > 99 ? '99+' : `+${count}`;
  }

  return {
    popoverOpen,
    layout,
    indicator,
    size,

    components: {
      root: Popover,
      triggerButton: 'button',
      content: 'ul',
      popoverSurface: PopoverSurface,
      tooltip: Tooltip,
    },
    root: {
      // Popover expects a child for its children. The children are added in the renderAvatarGroupPopover.
      children: <></>,
      size: 'small',
      trapFocus: true,
      ...restOfProps,
      open: popoverOpen,
      onOpenChange: handleOnPopoverChange,
    },
    triggerButton: resolveShorthand(props.triggerButton, {
      required: true,
      defaultProps: {
        children: triggerButtonChildren,
        type: 'button',
      },
    }),
    content: resolveShorthand(props.content, {
      required: true,
      defaultProps: {
        'aria-label': 'Overflow',
        children: children,
        role: 'list',
        tabIndex: 0,
      },
    }),
    popoverSurface: resolveShorthand(props.popoverSurface, {
      required: true,
    }),
    tooltip: resolveShorthand(props.tooltip, {
      required: true,
      defaultProps: {
        content: 'View more people.',
        relationship: 'label',
      },
    }),
  };
};
