import React, { PureComponent } from "react";

export type ContentState = {
  expanded: boolean;
};

export type ContentProps = {
  text: string;
  id: string;
};

class Content extends PureComponent<ContentProps, ContentState> {
  state: ContentState = { expanded: false };

  handleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  formatExpand = (text: string, isLimited: boolean) => {
    if (!isLimited) {
      return "";
    }
    return this.state.expanded ? "See less" : "See more";
  };

  processText = (text: string, isLimited: boolean) => {
    let trimmed = text.trim();
    if (!isLimited) {
      return {
        text: trimmed,
        isRestricted: false,
      };
    }
    const { expanded } = this.state;

    return {
      text: trimmed,
      isRestricted: !expanded,
    };
  };

  render() {
    const { text } = this.props;
    const isLimited = false; // Turn this to true to enable line restriction

    let processed = this.processText(text, isLimited);

    return isLimited ? (
      <React.Fragment>
        <span
          className={processed.isRestricted ? "restricted-content" : "content"}
        >
          {processed.text}
        </span>
        <a onClick={this.handleExpand}> {this.formatExpand(text, isLimited)}</a>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <span className="content" id={this.props.id}>
          {processed.text}
        </span>
      </React.Fragment>
    );
  }
}

export default Content;
