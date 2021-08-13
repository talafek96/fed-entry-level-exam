import React, { PureComponent } from "react";

export type TagProps = {
  label: string;
};

class Tag extends PureComponent<TagProps, {}> {
  // state = { :  }
  render() {
    const { label } = this.props;
    return <div className="tag">{label}</div>;
  }
}

export default Tag;
