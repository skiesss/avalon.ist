// External

import React, { Component, createRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

// Declaration

interface ScrollbarProps {
  data: any[];
  horizontal?: boolean;
}

interface ScrollbarState {
  items: any[];
}

class InfiniteScrollbars extends Component<ScrollbarProps, {}> {
  scrollbars = createRef<Scrollbars>();
  threshold = 0.98;
  prev = 0;
  floored = true;

  state: ScrollbarState = {
    items: [],
  };

  componentDidMount() {
    this.showInitialItems();
    const ref = this.scrollbars.current!;
    ref.scrollToBottom();
  }

  componentDidUpdate = (prevProps: ScrollbarProps) => {
    const { data } = this.props;
    // If new messages appear, add new messages
    if (data.length > prevProps.data.length) {
      const newData = data.slice(prevProps.data.length - data.length);
      console.log(1, newData);
      this.addItemsToEnd(newData);
    }
  }

  showInitialItems = () => {
    const { data } = this.props;
    // Show latest messages
    this.addItemsToEnd(data.slice(Math.max(data.length - 5, 0)));
  }

  addItemsToEnd = (data: any[]) => {
    this.setState({
      items: [...this.state.items, ...data]
    })
  }

  addItemsToStart = (data: any[]) => {
    this.setState({
      items: [...data, ...this.state.items]
    })
  }

  checkIfFloored = () => {
    try {
      const ref = this.scrollbars.current!;

      const top = ref.getValues().top;
      const delta = top - this.prev;
      this.prev = top;

      if (delta >= 0) {
        this.floored = top >= this.threshold;
      } else {
        this.floored = false;
      }
    } catch (e) {
      console.log(e);
    }
  };

  checkIfScrolledToTop = () => {
    const { data } = this.props;
    const { items } = this.state;

    const ref = this.scrollbars.current!;

    const top = ref.getValues().top;

    if (top == 0 && items.length < data.length) {
      // Show more messages
      const start = Math.max(data.length - items.length - 3, 0);
      const end = data.length - items.length;
      console.log(3, data, items);
      console.log(4, start, end);
      this.addItemsToStart(data.slice(start, end));
    }
  }

  autoScroll = () => {
    const ref = this.scrollbars.current!;

    if (this.floored) {
      this.prev = 0;

      ref.scrollToBottom();
    }
  };

  render() {
    return (
      <Scrollbars
        ref={this.scrollbars}
        autoHide
        autoHideTimeout={200}
        autoHideDuration={200}
        onScroll={(e) => {this.checkIfFloored(); this.checkIfScrolledToTop();}}
        renderTrackHorizontal={(props) => <div {...props} className="track-horizontal" />}
        renderTrackVertical={(props) => <div {...props} className="track-vertical" />}
        renderThumbHorizontal={(props) => (
          <div
            {...props}
            className={this.props.horizontal ? 'thumb-horizontal' : 'thumb-hidden'}
          />
        )}
        renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
        renderView={(props) => <div {...props} className="view" />}
      >
        {this.state.items}
      </Scrollbars>
    );
  }
}

export default InfiniteScrollbars;
